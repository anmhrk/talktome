"use client";

import { type Session } from "next-auth";
import { useEffect, useState } from "react";
import { generateFriend, loadFriend } from "../server/actions";
import { FriendContext } from "./friend-context";

export interface Friend {
  name: string;
  description: string;
  imageUrl: string;
}

export default function FriendHandler({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const [friend, setFriend] = useState<Friend | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeFriend() {
      try {
        if (session) {
          // if authenticated load friend from db
          const dbFriend = await loadFriend();
          setFriend(dbFriend as Friend);
        } else {
          // if not authenticated check localStorage first
          const storedFriend = localStorage.getItem("friend");
          if (storedFriend) {
            setFriend(JSON.parse(storedFriend) as Friend);
          } else {
            // if not authenticated and no friend in localStorage, generate new friend and store in localStorage

            // add logic for when unathenticated user creates new friend. this will run when that happens too
            const newFriend = await generateFriend();
            localStorage.setItem("friend", JSON.stringify(newFriend));
            setFriend(newFriend);
          }
        }
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    }

    void initializeFriend();
  }, [session]);

  return (
    <FriendContext.Provider value={{ friend, loading }}>
      {children}
    </FriendContext.Provider>
  );
}
