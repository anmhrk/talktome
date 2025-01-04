"use server";

export async function generateFriend() {
  try {
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
