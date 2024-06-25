import { redirect } from "next/navigation";
import db from "@/lib/db";
import { auth } from "@/auth";
import CurrentFriendsForm from "@/components/friends/CurrentFriendsForm";

export default async function CurrentFriends() {
  const session = await auth();
  if (!session) {
    return redirect("/");
  }

  const friendships = await db.friendship.findMany({
    where: {
      status: "accepted",
      OR: [
        { user1Id: session.session.user.id },
        { user2Id: session.session.user.id },
      ],
    },
    include: {
      user1: true,
      user2: true,
    },
  });

  const friends = friendships
    .map((friendship) => {
      if (friendship.user1Id === session.session.user.id) {
        return friendship.user2;
      }
      return friendship.user1;
    })
    .filter((user): user is User => user.name != null && user.email != null);

  return <CurrentFriendsForm users={friends} />;
}
