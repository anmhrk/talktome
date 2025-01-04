import Content from "~/components/content";
import Header from "~/components/header";
import { LuArrowUpRight } from "react-icons/lu";
import { auth } from "~/server/auth";
import FriendHandler from "~/components/friend-handler";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="min-h-screen text-neutral-900">
      <FriendHandler session={session!}>
        <Header session={session!} />
        <Content session={session!} />
      </FriendHandler>

      <footer className="fixed bottom-3 left-4 right-4 flex justify-center text-xs text-neutral-600">
        <div className="flex items-center gap-4 text-[13px]">
          <Link
            href="https://github.com/anmhrk/talktome"
            className="flex items-center hover:text-neutral-800 hover:underline"
          >
            github
            <LuArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="https://x.com/anmhrk"
            className="flex items-center hover:text-neutral-800 hover:underline"
          >
            x
            <LuArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </footer>
    </main>
  );
}
