import { motion } from "motion/react";
import { Button } from "./ui/button";
import { RiArrowGoBackFill } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { Separator } from "./ui/separator";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { deleteAccount, loadStats } from "~/server/actions";
import { toast } from "sonner";

interface AccountProps {
  setShowAccount: (show: boolean) => void;
}

export default function Account({ setShowAccount }: AccountProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalFriends: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await loadStats();
        setStats(data);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setStatsLoading(false);
      }
    };

    void fetchStats();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="relative z-50 min-h-screen bg-white">
        <header className="min-h-16 w-full">
          <div className="mx-auto max-w-3xl px-3 py-4">
            <div className="flex justify-between">
              <div className="h-8 w-8" />
              <Button
                variant="custom"
                className="h-8 w-8"
                onClick={() => setShowAccount(false)}
              >
                <RiArrowGoBackFill className="!h-5 !w-5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="-mt-40 flex min-h-[calc(100vh-4rem)] items-center">
          <div className="mx-auto w-full max-w-3xl px-6">
            <div className="flex flex-col items-center">
              <h1 className="mb-3 font-serif text-6xl">Account</h1>
              <p className="text-md mb-6 text-[#7B7B7B]">
                Signed in with {session?.user?.email}
              </p>
              <Separator className="mb-8" />

              <div className="flex w-full items-center">
                <div className="w-1/2 space-y-6">
                  {statsLoading ? (
                    <div className="flex h-48 w-full items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          Total Messages Exchanged
                        </span>
                        <span className="font-bold">{stats.totalMessages}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          Total Friends Made
                        </span>
                        <span className="font-bold">{stats.totalFriends}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center px-8">
                  <Separator orientation="vertical" className="h-48" />
                </div>

                <div className="flex w-1/2 items-center">
                  <div className="w-full space-y-3">
                    <Button
                      className="w-full rounded-2xl"
                      onClick={() => signOut()}
                    >
                      Logout
                    </Button>

                    <Button
                      className="w-full rounded-2xl bg-red-500 hover:bg-red-600"
                      onClick={async () => {
                        try {
                          setLoading(true);
                          await deleteAccount();
                          await signOut();
                        } catch (error) {
                          if (error instanceof Error) {
                            toast.error(error.message);
                          }
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      {loading ? "Deleting..." : "Delete Account"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
