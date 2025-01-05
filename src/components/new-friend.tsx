import { motion } from "motion/react";
import { Button } from "./ui/button";

interface NewFriendProps {
  setShowNewFriend: (show: boolean) => void;
  setCreateNewFriend: (create: boolean) => void;
}

export default function NewFriend({
  setShowNewFriend,
  setCreateNewFriend,
}: NewFriendProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="relative z-50 grid min-h-screen place-items-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <p className="font-serif text-4xl">Meet Someone New?</p>
          <div className="flex gap-7">
            <Button
              className="h-11 rounded-2xl bg-[#27272A] text-lg text-white shadow-none hover:bg-[#FC2602]"
              onClick={() => {
                setShowNewFriend(false);
                setCreateNewFriend(true);
              }}
            >
              Yes
            </Button>
            <Button
              className="h-11 rounded-2xl bg-background text-lg text-neutral-900 shadow-none hover:bg-[#F5F5F4]"
              onClick={() => setShowNewFriend(false)}
            >
              No
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
