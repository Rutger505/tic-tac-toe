import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CurrentFriendsForm from "@/components/friends/CurrentFriendsForm";
import { User } from "@/types/user";

export default async function CurrentFriends() {
  const session = await auth();
  if (!session) {
    return redirect("/");
  }

  const friendships = await db.friendship.findMany({
    where: {
      status: "accepted",
      OR: [{ user1Id: session.user.id }, { user2Id: session.user.id }],
    },
    include: {
      user1: true,
      user2: true,
    },
  });

  const friends = friendships
    .map((friendship): Partial<User> => {
      if (!("user1" in friendship) || !("user2" in friendship)) {
        throw new Error("Friendship is missing user1 or user2");
      }

      if (friendship.user1Id === session.user.id) {
        return {
          id: friendship.user2.id,
          name: friendship.user2.name ?? undefined,
          email: friendship.user2.email ?? undefined,
          image: friendship.user2.image ?? undefined,
        };
      }
      return {
        id: friendship.user1.id,
        name: friendship.user1.name ?? undefined,
        email: friendship.user1.email ?? undefined,
        image: friendship.user1.image ?? undefined,
      };
    })
    .filter(
      (user): user is User =>
        !!user.id && !!user.name && !!user.email && !!user.image,
    );

  return <CurrentFriendsForm users={friends} />;
}
