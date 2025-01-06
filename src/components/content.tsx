"use client";

import { Button } from "./ui/button";
import Image from "next/image";
import { type Friend } from "~/app/page";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaXmark } from "react-icons/fa6";
import { BiSolidMicrophone, BiSolidMicrophoneOff } from "react-icons/bi";
import { toast } from "sonner";
import { generateResponse } from "~/server/actions";

interface ContentProps {
  friend: Friend | null;
  loading: boolean;
  creatingFriend: boolean;
}

type Status = "idle" | "listening" | "thinking" | "speaking" | "error";

export default function Content({
  friend,
  loading,
  creatingFriend,
}: ContentProps) {
  const [conversationStarted, setConversationStarted] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(
    null,
  );
  const [status, setStatus] = useState<Status>("idle");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const checkMicPermission = async () => {
    try {
      const permissionResult = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setHasMicPermission(true);
      permissionResult.getTracks().forEach((track) => track.stop());
    } catch (error) {
      setHasMicPermission(false);
      throw new Error(
        "Microphone error: " +
          String(error instanceof Error ? error.message : error),
      );
    }
  };

  const handleConversation = async () => {
    try {
      await checkMicPermission();

      if (hasMicPermission && friend) {
        if (typeof window === "undefined") return;

        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          throw new Error("Speech recognition not supported in this browser");
        }

        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setStatus("listening");
        };

        recognition.onresult = async (event) => {
          const current = event.resultIndex;
          const transcript = event.results[current]?.[0]?.transcript;

          if (event.results[current]?.isFinal && transcript) {
            setStatus("thinking");
            // const audioURL = await generateResponse(transcript, friend?.id);
            // setStatus("speaking");
            // const audio = new Audio(audioURL);
            // await audio.play();
            // setStatus("idle");
          }
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);

          if (event.error === "no-speech") {
            // restart instead
            recognition.stop();
            recognition.start();
            return;
          }

          setStatus("error");
          throw new Error(`Speech recognition error: ${event.error}`);
        };

        recognition.onend = () => {
          // only restart if still in conversation and not in error state
          if (conversationStarted && status !== "error") {
            recognition.start();
          } else {
            setStatus("idle");
          }
        };

        recognition.start();
        setConversationStarted(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          duration: 10000,
        });
      }
    }
  };

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
            width={180}
            height={180}
            alt={friend?.name ?? ""}
            className="rounded-full object-cover shadow-md"
          />
          {status}
          <AnimatePresence mode="wait">
            {!conversationStarted ? (
              <>
                <motion.p
                  className="mb-2 font-serif text-2xl font-medium"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {friend?.name} wants to talk to you
                </motion.p>
                <motion.p
                  className="max-w-[400px] text-center text-sm text-neutral-500"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {friend?.description}
                </motion.p>
                <Button
                  className="mt-4 rounded-xl bg-[#F5F5F4] px-8 py-5 text-neutral-900 shadow-none hover:bg-[#F5F5F4] hover:opacity-90"
                  onClick={handleConversation}
                >
                  Start conversation
                </Button>
                <Button
                  onClick={async () => {
                    const { audioBlob } = await generateResponse(
                      "thats so nice to hear",
                      friend?.id ?? "",
                    );
                    const url = URL.createObjectURL(audioBlob);
                    // window.open(url, "_blank");
                    const audio = new Audio(url);
                    await audio.play();
                  }}
                >
                  Test
                </Button>
              </>
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="mb-3 font-serif text-xl">{friend?.name}</p>
                <div className="flex gap-3">
                  <Button
                    variant="custom"
                    onClick={() =>
                      setStatus(status === "listening" ? "idle" : "listening")
                    }
                    className={`h-12 w-12 ${status === "listening" && "bg-[#FEEFED]"}`}
                  >
                    {status === "listening" ? (
                      <BiSolidMicrophoneOff className="!h-6 !w-6 text-red-500" />
                    ) : (
                      <BiSolidMicrophone className="!h-6 !w-6" />
                    )}
                  </Button>
                  <Button
                    variant="custom"
                    onClick={() => setConversationStarted(false)}
                    className="h-12 w-12"
                  >
                    <FaXmark className="!h-6 !w-6" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
