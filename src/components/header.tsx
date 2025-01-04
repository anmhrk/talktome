"use client";

import { HiRefresh } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { type Friend } from "~/app/page";
import { Skeleton } from "./ui/skeleton";

interface HeaderProps {
  friend: Friend | null;
  loading: boolean;
}

export default function Header({ friend, loading }: HeaderProps) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <header className="min-h-16 w-full border-b border-gray-100">
        <div className="mx-auto max-w-3xl px-3 py-2">
          <div className="flex items-center justify-between">
            <Button variant="custom" className="h-8 w-8">
              <HiRefresh className="!h-5 !w-5" />
            </Button>

            <div className="flex items-center gap-3.5">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Skeleton className="h-7 w-32" />
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              ) : (
                <>
                  <span className="font-serif text-xl">{friend?.name}</span>
                  <div className="relative">
                    <Image
                      src={friend?.imageUrl ?? ""}
                      alt={friend?.name ?? ""}
                      className="h-12 w-12 rounded-full object-cover"
                      width={32}
                      height={32}
                    />
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500" />
                  </div>
                </>
              )}
            </div>

            <Button
              variant="custom"
              className="h-8 w-8"
              onClick={() => {
                setShowProfile(true);
              }}
            >
              <IoMdSettings className="!h-5 !w-5" />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
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
