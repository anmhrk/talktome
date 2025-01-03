import { auth } from "~/server/auth";

import Content from "~/components/content";
import Header from "~/components/header";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="min-h-screen text-neutral-900">
      <Header session={session!} />
      <Content session={session!} />
      <footer>{/* Footer */}</footer>
    </main>
  );
}
