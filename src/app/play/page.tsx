import { redirect } from "next/navigation";
import { auth } from "@/auth";
import PlayPage from "@/components/play/PlayPage";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }

  return <PlayPage loggedInUser={session.session.user} />;
}
