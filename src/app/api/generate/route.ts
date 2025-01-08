import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "~/server/db";
import { friends } from "~/server/db/schema";
import axios from "axios";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Friend {
  name: string;
  gender: string;
  voice: string;
}

const voices = {
  male: ["aura-orion-en", "aura-perseus-en", "aura-angus-en", "aura-zeus-en"],
  female: ["aura-asteria-en", "aura-luna-en", "aura-stella-en"],
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      type: "friend" | "response";
      friendId?: string;
      userMessage?: string;
      usersName?: string;
    };

    if (body.type === "friend") {
      const friendResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
              - Generate a random friend's name. First name only. Don't keep using names like "Maya" or "Luna". There are so many more names out there.
              - The friend can be either male or female.
              - Also randomly select a voice based on the friend's gender from this list:
                Male voices: ${voices.male.join(", ")}
                Female voices: ${voices.female.join(", ")}
              - Format the response as JSON with 'name', 'gender', and 'voice' fields.
            `,
          },
        ],
        response_format: { type: "json_object" },
      });

      const messageContent = friendResponse?.choices?.[0]?.message?.content;
      if (!messageContent) {
        throw new Error("Either there was an error or I'm out of API credits.");
      }

      const friendData = JSON.parse(messageContent) as Friend;

      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: `
          Create a profile picture for ${friendData.name}. Their gender is ${friendData.gender}.
          Here's a sample prompt:
          "A photo-realistic and detailed profile picture of a young woman with shoulder-length dark brown hair, wearing a casual outfit. 
          She has warm, natural makeup and a friendly smile. The background is softly blurred with neutral tones, giving a professional yet approachable look. 
          The lighting is soft and flattering, highlighting her facial features."
          Make your prompt as detailed as this one.
        `,
        n: 1,
        quality: "standard",
        size: "1024x1024",
        response_format: "b64_json",
      });

      const base64Image = imageResponse?.data?.[0]?.b64_json;

      if (!base64Image) {
        throw new Error("Either there was an error or I'm out of API credits.");
      }

      return NextResponse.json({
        name: friendData.name,
        voice: friendData.voice,
        base64Image: base64Image,
      });
    } else if (body.type === "response") {
      const friend = await db.query.friends.findFirst({
        where: eq(friends.id, body.friendId ?? ""),
      });

      if (!friend) {
        throw new Error("Friend not found");
      }

      const messageResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
              - You are a friend of the user and are in a conversation with them.
              <your_profile>
                <name>${friend.name}</name>
              </your_profile>
              - User's name: ${body.usersName}
              - User's latest message: ${body.userMessage}
              - You need to generate a response to the user's latest message.
              - Previous messages between you and the user (if any) are also given to you as context.
              - Previous messages: ${friend.messages?.map((m) => `${m.role}: ${m.message}`).join("\n") ?? ""}

              INSTRUCTIONS FOR RESPONSE:
              - Respond as if you are talking to your closest friend.
              - Show genuine emotion and personality.
              - You are allowed to use conversational slang.
              - Make it seem like a natural human like conversation.
              - Don't be too formal, corny, or cheesy.
              - Your response will be converted to speech so make sure it's not super text-like language.
              - Only address the user by name when you are greeting them. Don't overdo it.
              - DO NOT use emojis.

              IMPORTANT:
              - If there are no previous messages and user's latest message is also empty, then respond as if you are just starting a conversation.
            `,
          },
        ],
      });

      const messageContent = messageResponse?.choices?.[0]?.message?.content;
      if (!messageContent) {
        throw new Error("Either there was an error or I'm out of API credits.");
      }

      const ttsResponse = await axios({
        method: "POST",
        url: "https://api.deepgram.com/v1/speak",
        params: {
          model: friend.voice,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        },
        data: {
          text: messageContent,
        },
        responseType: "stream",
      });

      const stream = ttsResponse.data as ReadableStream;

      if (!stream) {
        throw new Error(
          "Response was generated but no audio stream was returned",
        );
      }

      await db
        .update(friends)
        .set({
          messages: [
            ...(friend.messages ?? []),
            { role: "user", message: body.userMessage ?? "" },
            { role: "friend", message: messageContent },
          ],
        })
        .where(eq(friends.id, friend.id));

      return new Response(stream, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Disposition": "inline",
        },
      });
    } else {
      throw new Error("Invalid request type");
    }
  } catch (error) {
    console.error(error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const status = axios.isAxiosError(error)
      ? (error.response?.status ?? 500)
      : 500;

    return NextResponse.json({ message: errorMessage }, { status });
  }
}
