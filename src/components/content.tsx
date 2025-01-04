"use client";

import { type Session } from "next-auth";
import { Button } from "./ui/button";
import Image from "next/image";
import { generateFriend, getIp } from "../server/actions";
import { useFriend } from "./friend-context";

interface ContentProps {
  session: Session;
}

export default function Content({ session }: ContentProps) {
  const { friend, loading } = useFriend();

  if (loading) return <div>Loading...</div>;

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
      <Button onClick={getIp}>Get IP</Button>
    </div>
  );
}
