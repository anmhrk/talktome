"use client";

import { Button } from "./ui/button";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { type Friend } from "~/app/page";
import { generateFriend } from "~/server/actions";

interface ContentProps {
  friend: Friend | null;
  loading: boolean;
}

export default function Content({ friend, loading }: ContentProps) {
  if (loading) return <div>Loading...</div>;
  if (!friend) return <div>No friend found</div>;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4">
      <Image
        src="/pic.jpg"
        width={128}
        height={128}
        alt="avatar"
        className="rounded-full"
      />
      <p className="mb-2 text-lg">Faith wants to talk to you</p>
      <Button className="rounded-full bg-neutral-900 px-6 py-2 text-white hover:bg-neutral-800">
        Start conversation
      </Button>
      <Button onClick={generateFriend}>Generate Friend</Button>
      <Button onClick={() => signOut()}>Sign out</Button>
    </div>
  );
}
