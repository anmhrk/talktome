"use client";

import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
interface AuthScreenProps {
  onClose: () => void;
}

export default function AuthScreen({ onClose }: AuthScreenProps) {
  return (
    <div className="relative z-50 flex min-h-screen flex-col bg-white">
      <div className="p-4">
        <button
          className="text-md rounded-2xl bg-[#F5F5F4] px-4 py-2.5 font-medium shadow-none"
          onClick={onClose}
        >
          back
        </button>
      </div>

      <div className="flex flex-1 justify-center">
        <div className="flex max-w-2xl flex-1 flex-col items-center justify-center gap-10">
          <h1 className="font-serif text-7xl">talktome</h1>
          <Separator />
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-sm p-2.5 font-medium hover:border-[#D1E3FC] hover:bg-[#F9FBFE]"
            onClick={() => signIn("google")}
          >
            <FcGoogle className="!h-5 !w-5" />
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
