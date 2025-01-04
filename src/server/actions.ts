"use server";

import { ratelimit } from "./ratelimit";
import { auth } from "./auth";
import { db } from "./db";
import { friends } from "./db/schema";
import { eq } from "drizzle-orm";

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
      `${process.env.NEXT_PUBLIC_APP_URL}/api/friend`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const error = (await response.json()) as { message: string };
      throw new Error(error.message);
    }

    const data = (await response.json()) as {
      name: string;
      description: string;
      imageUrl: string;
    };

    // uploadthing logic here. imageUrl returned is actually a file. needs changing.

    if (session) {
      await db.insert(friends).values({
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        createdBy: session.user.id,
      });
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function loadFriend() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const [latestFriend] = await db
    .select()
    .from(friends)
    .where(eq(friends.createdBy, session.user.id))
    .orderBy(friends.createdAt)
    .limit(1);

  return latestFriend;
}
