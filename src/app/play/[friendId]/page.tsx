import { redirect } from "next/navigation";
import { auth } from "@/auth";
import PlayFriendPage from "@/components/play/PlayPageFriend";

export default async function PlayFriend() {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }

  return <PlayFriendPage loggedInUser={session.session.user} />;
}
