import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import AddFriendsForm from "@/components/friends/AddFriendsForm";
import { User } from "@/types/types";

export default async function AddFriends() {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }

  const users = (
    await db.user.findMany({
      where: {
        id: {
          // @ts-ignore
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
        // @ts-ignore
        { user1Id: session.session.user.id },
        // @ts-ignore
        { user2Id: session.session.user.id },
      ],
    },
  });

  return <AddFriendsForm users={users} friendShips={friendships} />;
}
