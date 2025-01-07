"use client";

import { Button } from "./ui/button";
import Image from "next/image";
import { type Friend } from "~/app/page";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaXmark } from "react-icons/fa6";
import { BiSolidMicrophone } from "react-icons/bi";
import { toast } from "sonner";
import { generateResponse, checkIfNoMessages } from "~/server/actions";

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
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null,
  );

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

  const handleStartConversation = async () => {
    try {
      await checkMicPermission();
      setConversationStarted(true);

      const noMessages = await checkIfNoMessages(friend?.id ?? "");

      // if no prev messages, friend will greet
      if (noMessages) {
        setStatus("thinking");
        const { audioBlob } = await generateResponse("", friend?.id ?? "");
        const audio = new Audio(URL.createObjectURL(audioBlob));
        setStatus("speaking");
        await audio.play();
        setStatus("idle");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          duration: 10000,
        });
      }
    }
  };

  const handleMicToggle = async () => {
    if (!hasMicPermission || !friend) return;

    try {
      if (status === "listening") {
        recognition?.stop();
        setStatus("idle");
        setRecognition(null);
        return;
      }

      if (typeof window === "undefined") return;

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error("Speech recognition not supported in this browser");
      }

      const newRecognition = new SpeechRecognition();
      newRecognition.continuous = false;
      newRecognition.interimResults = true;
      newRecognition.lang = "en-US";

      newRecognition.onstart = () => {
        setStatus("listening");
      };

      newRecognition.onresult = async (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current]?.[0]?.transcript;

        if (event.results[current]?.isFinal && transcript) {
          try {
            newRecognition.stop();
            setStatus("thinking");
            const { audioBlob } = await generateResponse(
              transcript,
              friend?.id,
            );
            const audio = new Audio(URL.createObjectURL(audioBlob));
            setStatus("speaking");
            await audio.play();
          } catch (error) {
            console.error("Error processing speech:", error);
            setStatus("error");
          } finally {
            setStatus("idle");
          }
        }
      };

      newRecognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setStatus("error");
        throw new Error(`Speech recognition error: ${event.error}`);
      };

      newRecognition.onend = () => {
        setStatus("idle");
        setRecognition(null);
      };

      setRecognition(newRecognition);
      newRecognition.start();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          duration: 10000,
        });
      }
    }
  };

  const cleanup = () => {
    if (recognition) {
      recognition.stop();
    }
    setConversationStarted(false);
    setStatus("idle");
    setRecognition(null);
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
            className={`rounded-full object-cover shadow-md transition-all duration-300 ${
              status === "speaking" ? "animate-pulse" : ""
            } ${status === "thinking" ? "opacity-70" : ""}`}
          />
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
                  onClick={handleStartConversation}
                >
                  Start conversation
                </Button>
              </>
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-serif text-xl">{friend?.name}</p>
                {status === "idle" && (
                  <p className="mb-2 text-sm text-neutral-500">
                    Press the mic button to speak and send a message
                  </p>
                )}
                {(status === "thinking" || status === "speaking") && (
                  <div className="h-4 w-4 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900" />
                )}
                <div className="flex gap-3">
                  <Button
                    variant="custom"
                    onClick={handleMicToggle}
                    disabled={status === "thinking"}
                    className="h-12 w-12"
                  >
                    <BiSolidMicrophone className="!h-6 !w-6" />
                  </Button>
                  <Button
                    variant="custom"
                    onClick={cleanup}
                    className="h-12 w-12 transition-all active:scale-95"
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
