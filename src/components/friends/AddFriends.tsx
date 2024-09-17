import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import AddFriendsForm from "@/components/friends/AddFriendsForm";
import { User } from "next-auth";

export default async function AddFriends() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/");
  }

  const users = (
    await db.user.findMany({
      where: {
        id: {
          not: session.user.id,
        },
        name: {
          not: null,
        },
        email: {
          not: null,
        },
      },
    })
  ).filter(
    (user): user is User =>
      !!user.id && !!user.name && !!user.email && !!user.image,
  ) as User[];

  const friendships = await db.friendship.findMany({
    where: {
      OR: [{ user1Id: session.user.id }, { user2Id: session.user.id }],
    },
  });

  return <AddFriendsForm users={users} friendShips={friendships} />;
}
