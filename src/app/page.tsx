import Content from "~/components/content";
import Header from "~/components/header";
import { LuArrowUpRight } from "react-icons/lu";
import { auth } from "~/server/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="min-h-screen text-neutral-900">
      <Header session={session!} />
      <Content session={session!} />

      <footer className="fixed bottom-3 left-4 right-4 flex justify-center text-xs text-neutral-600">
        <div className="flex items-center gap-4 text-[13px]">
          {/* add Link with hrefs instead of buttons */}
          <button className="flex items-center hover:text-neutral-800 hover:underline">
            github
            <LuArrowUpRight className="h-4 w-4" />
          </button>
          <button className="flex items-center hover:text-neutral-800 hover:underline">
            x
            <LuArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </main>
  );
}
