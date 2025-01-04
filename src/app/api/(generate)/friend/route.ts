import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Friend {
  name: string;
  description: string;
}

export async function POST() {
  try {
    const friendResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            - Generate a random friend's name and personality description.
            - Format the response as JSON with 'name' and 'description' fields.
            - Keep the description between 2-3 sentences.
            - The name should be the first name only.
            - The friend can be either male or female. Use appropriate pronouns in the description.
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
        Create a profile picture for ${friendData.name} using ${friendData.description} as context.
        Here's a sample prompt:
        "A photo-realistic and detailed profile picture of a young woman with shoulder-length dark brown hair, wearing a casual outfit. 
        She has warm, natural makeup and a friendly smile. The background is softly blurred with neutral tones, giving a professional yet approachable look. 
        The lighting is soft and flattering, highlighting her facial features."
        Make your prompt as detailed as this one.
      `,
      n: 1,
      quality: "standard",
      size: "1024x1024",
    });

    const imageUrl = imageResponse?.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error("Either there was an error or I'm out of API credits.");
    }

    return NextResponse.json({
      name: friendData.name,
      description: friendData.description,
      imageUrl,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate friend" },
      { status: 500 },
    );
  }
}
