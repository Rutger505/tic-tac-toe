import { auth } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import AddFriendsForm from "@/components/friends/AddFriendsForm";
import { User } from "@/types/user";

export default async function AddFriends() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/");
  }

  const users = (await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
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
      image: {
        not: null,
      },
    },
  })) as User[];

  const friendships = await db.friendship.findMany({
    where: {
      OR: [{ user1Id: session.user.id }, { user2Id: session.user.id }],
    },
  });

  return <AddFriendsForm users={users} friendShips={friendships} />;
}
