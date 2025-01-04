"use server";

import { headers } from "next/headers";
import { unauthenticatedRatelimit, authenticatedRatelimit } from "./ratelimit";
import { auth } from "./auth";
import { db } from "./db";
import { friends } from "./db/schema";
import { eq } from "drizzle-orm";

export async function getIp() {
  const headersList = await headers();
  return headersList.get("x-forwarded-for") ?? "127.0.0.1";
}

export async function generateFriend() {
  try {
    const session = await auth();

    if (!session) {
      const { success } = await unauthenticatedRatelimit.limit(await getIp());
      if (!success) {
        throw new Error("Please make an account to talk to more friends.");
      }
    } else {
      // const { success } = await authenticatedRatelimit.limit(session.user.id);
      // if (!success) {
      //   throw new Error(
      //     "Reached max requests for now. Please try again later.",
      //   );
      // }
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

    // url returned expires in 1 hour. will need to address this. uploadthing?

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

export async function saveFriendFromLocalStorage(friendData: {
  name: string;
  description: string;
  imageUrl: string;
}) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await db.insert(friends).values({
    ...friendData,
    createdBy: session.user.id,
  });
}
