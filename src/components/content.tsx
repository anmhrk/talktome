import { type Session } from "next-auth";

interface ContentProps {
  session: Session;
}

export default function Content({ session }: ContentProps) {
  return <div>Content</div>;
}
