"use client";

import Content from "~/components/content";
import Header from "~/components/header";
import Footer from "~/components/footer";
import { useEffect, useState } from "react";
import { generateFriend, loadFriend } from "~/server/actions";
import { toast } from "sonner";

export interface Friend {
  name: string;
  description: string;
  imageUrl: string;
}

export default function HomePage() {
  const [friend, setFriend] = useState<Friend | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeFriend() {
      try {
        const dbFriend = await loadFriend();
        if (dbFriend) {
          setFriend(dbFriend as Friend);
        } else {
          const newFriend = await generateFriend();
          setFriend(newFriend);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    void initializeFriend();
  }, []);

  return (
    <main className="min-h-screen">
      <Header friend={friend} loading={loading} />
      <Content friend={friend} loading={loading} />

      <Footer />
    </main>
  );
}
