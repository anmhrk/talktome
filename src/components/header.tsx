"use client";

import { LuRefreshCw } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { useState } from "react";
import { type Session } from "next-auth";
import { motion, AnimatePresence } from "motion/react";
import { signOut } from "next-auth/react";

import { Button } from "~/components/ui/button";
import AuthScreen from "./auth-screen";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  session: Session;
}

export default function Header({ session }: HeaderProps) {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <header className="w-full border-b border-gray-100">
        <div className="mx-auto max-w-3xl px-3 py-2">
          <div className="flex items-center justify-between">
            <Button variant="custom" className="h-8 w-8">
              <LuRefreshCw />
            </Button>

            <div className="flex items-center gap-3">
              <span className="font-serif text-xl">Faith</span>
              <div className="relative">
                {/* <Image
                src="/avatar.png"
                alt="John Doe"
                className="h-8 w-8 rounded-full"
                width={32}
                height={32}
              /> */}
                <div className="h-12 w-12 rounded-full bg-neutral-200" />
                <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
              </div>
            </div>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="custom" className="h-8 w-8">
                    <IoMdSettings className="!h-5 !w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="custom"
                className="h-8 w-8"
                onClick={() => setShowAuth(true)}
              >
                <IoMdSettings className="!h-5 !w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showAuth && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <AuthScreen onClose={() => setShowAuth(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
