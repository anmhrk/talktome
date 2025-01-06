"use server";

import { ratelimit } from "./ratelimit";
import { auth } from "./auth";
import { db } from "./db";
import { friends } from "./db/schema";
import { eq, desc } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

const utApi = new UTApi();

export async function generateFriend() {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const { success } = await ratelimit.limit(session.user.id);
    if (!success) {
      throw new Error("Reached max requests for now. Please try again later.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "friend" }),
      },
    );

    if (!response.ok) {
      const error = (await response.json()) as { message: string };
      throw new Error(error.message);
    }

    const data = (await response.json()) as {
      name: string;
      description: string;
      base64Image: string;
    };

    const uploadResponse = await utApi.uploadFiles(
      new File(
        [Buffer.from(data.base64Image, "base64")],
        `${data.name}-${session.user.id}.png`,
        {
          type: "image/png",
        },
      ),
    );

    const imageUrl = uploadResponse?.data?.url;

    if (!imageUrl) {
      throw new Error("Failed to upload image");
    }

    if (session) {
      await db.insert(friends).values({
        name: data.name,
        description: data.description,
        imageUrl: imageUrl,
        createdBy: session.user.id,
      });
    }
  } catch (error) {
    throw error;
  }
}

export async function loadFriend() {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const [latestFriend] = await db
      .select()
      .from(friends)
      .where(eq(friends.createdBy, session.user.id))
      .orderBy(desc(friends.createdAt))
      .limit(1);

    return latestFriend;
  } catch (error) {
    throw error;
  }
}

export async function generateResponse(message: string, friendId: string) {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          type: "response",
          friendId: friendId,
          userMessage: message,
          usersName: session.user.name,
        }),
      },
    );

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message || "An error occurred");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const audioBlob = await response.blob();
    const audioURL = URL.createObjectURL(audioBlob);
    return { audioURL, audioBlob };
  } catch (error) {
    throw error;
  }
}
