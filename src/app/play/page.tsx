import { auth, signIn } from "@/auth";
import PlayPage from "@/components/play/PlayPage";

export default async function QueuePage() {
  const session = await auth();

  if (!session?.user) {
    await signIn();
    return;
  }

  return <PlayPage loggedInUser={session.user} />;
}
