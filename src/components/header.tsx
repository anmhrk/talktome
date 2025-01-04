"use client";

import { HiRefresh } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";
import { useState } from "react";
import { type Session } from "next-auth";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "~/components/ui/button";
import AuthScreen from "./auth-screen";

interface HeaderProps {
  session: Session;
}

export default function Header({ session }: HeaderProps) {
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <header className="w-full border-b border-gray-100">
        <div className="mx-auto max-w-3xl px-3 py-2">
          <div className="flex items-center justify-between">
            <Button variant="custom" className="h-8 w-8">
              <HiRefresh className="!h-5 !w-5" />
            </Button>

            <div className="flex items-center gap-3.5">
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

            <Button
              variant="custom"
              className="h-8 w-8"
              onClick={() => {
                if (!session) {
                  setShowAuth(true);
                } else {
                  // setShowProfile(true);
                }
              }}
            >
              <IoMdSettings className="!h-5 !w-5" />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showAuth && <AuthScreen onClose={() => setShowAuth(false)} />}

        {showProfile && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* TODO: make profile later */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
