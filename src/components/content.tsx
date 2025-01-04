"use client";

import { Button } from "./ui/button";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { type Friend } from "~/app/page";

interface ContentProps {
  friend: Friend | null;
  loading: boolean;
  creatingFriend: boolean;
}

export default function Content({
  friend,
  loading,
  creatingFriend,
}: ContentProps) {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4">
      {loading ? (
        <>
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900" />
          {creatingFriend && (
            <p className="font-serif text-lg">
              Your AI friend will be here in just a moment...
            </p>
          )}
        </>
      ) : (
        <>
          <Image
            src={friend?.imageUrl ?? ""}
            width={128}
            height={128}
            alt={friend?.name ?? ""}
            className="rounded-full object-cover shadow-md"
          />
          <p className="mb-2 font-serif text-lg">
            {friend?.name} wants to talk to you
          </p>
          <Button className="rounded-full bg-neutral-900 px-6 py-2 text-white hover:bg-neutral-800">
            Start conversation
          </Button>
          <Button onClick={() => signOut()}>Sign out</Button>
        </>
      )}
    </div>
  );
}
