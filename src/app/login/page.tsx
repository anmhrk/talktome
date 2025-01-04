import { FcGoogle } from "react-icons/fc";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import Footer from "~/components/footer";
import { signIn } from "~/server/auth";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function AuthScreen() {
  const session = await auth();
  if (session) {
    redirect("/");
  }

  return (
    <>
      <div className="grid min-h-screen place-items-center">
        <div className="flex flex-col items-center gap-10">
          <h1 className="font-serif text-7xl">talktome</h1>
          <Separator />
          <form
            action={async () => {
              "use server";
              await signIn("google", {
                redirectTo: "/",
              });
            }}
          >
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-sm p-2.5 font-medium hover:border-[#D1E3FC] hover:bg-[#F9FBFE]"
            >
              <FcGoogle className="!h-5 !w-5" />
              Sign in with Google
            </Button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
