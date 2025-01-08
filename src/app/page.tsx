"use client";

import { useEffect, useState } from "react";
import { generateFriend, loadFriend } from "~/server/actions";
import { toast } from "sonner";
import Content from "~/components/content";
import Header from "~/components/header";
import Footer from "~/components/footer";

export interface Friend {
  name: string;
  imageUrl: string;
  id: string;
}

export default function HomePage() {
  const [friend, setFriend] = useState<Friend | null>(null);
  const [loading, setLoading] = useState(true);
  const [createNewFriend, setCreateNewFriend] = useState(false);
  const [creatingFriend, setCreatingFriend] = useState(false);

  useEffect(() => {
    async function initializeFriend() {
      try {
        setLoading(true);
        const dbFriend = await loadFriend();
        if (dbFriend && !createNewFriend) {
          setFriend(dbFriend as Friend);
        } else {
          setCreatingFriend(true);
          await generateFriend();
          const newFriend = await loadFriend();
          setFriend(newFriend as Friend);
          setCreatingFriend(false);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    void initializeFriend();
  }, [createNewFriend]);

  return (
    <main className="min-h-screen">
      <Header
        friend={friend}
        loading={loading}
        setCreateNewFriend={setCreateNewFriend}
      />
      <Content
        friend={friend}
        loading={loading}
        creatingFriend={creatingFriend}
      />

      <Footer />
    </main>
  );
}
