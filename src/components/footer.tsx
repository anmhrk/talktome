import { LuArrowUpRight } from "react-icons/lu";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-3 left-4 right-4 flex justify-center text-neutral-600">
      <div className="flex items-center gap-4 text-[14px]">
        <Link
          href="https://github.com/anmhrk/talktome"
          className="flex items-center hover:text-neutral-800 hover:underline"
        >
          github
          <LuArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </footer>
  );
}
