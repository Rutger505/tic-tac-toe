import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import AddFriendsForm from "@/components/friends/AddFriendsForm";

export default async function AddFriends() {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }

  const users = (
    await db.user.findMany({
      where: {
        id: {
          not: session.session.user.id,
        },
      },
    })
  ).filter((user): user is User => {
    return user.name != null && user.email != null;
  });

  const friendships = await db.friendship.findMany({
    where: {
      OR: [
        { user1Id: session.session.user.id },
        { user2Id: session.session.user.id },
      ],
    },
  });

  return <AddFriendsForm users={users} friendShips={friendships} />;
}
