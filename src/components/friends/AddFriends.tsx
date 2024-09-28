import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import AddFriendsForm from "@/components/friends/AddFriendsForm";
import { getUsers } from "@/lib/user";

export default async function AddFriends() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/");
  }

  const users = await getUsers();

  const friendships = await db.friendship.findMany({
    where: {
      OR: [{ user1Id: session.user.id }, { user2Id: session.user.id }],
    },
  });

  return <AddFriendsForm users={users} friendShips={friendships} />;
}
