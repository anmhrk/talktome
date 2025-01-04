"use server";

import { headers } from "next/headers";
import { unauthenticatedRatelimit, authenticatedRatelimit } from "./ratelimit";
import { auth } from "./auth";

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
      const { success } = await authenticatedRatelimit.limit(session.user.id);
      if (!success) {
        throw new Error(
          "Reached max requests for now. Please try again later.",
        );
      }
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
    console.log(data);
  } catch (error) {
    throw error;
  }
}
