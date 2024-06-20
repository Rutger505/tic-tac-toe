import { redirect } from "next/navigation";
import db from "@/lib/db";
import { TrashIcon } from "@/components/icons/TrashIcon";
import UserList from "@/components/friends/UserList";
import { auth } from "@/auth";

// Define a type for non-nullable User
type NonNullableUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: Date;
  image: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function CurrentFriends() {
  const { session } = await auth();
  if (!session) {
    return redirect("/api/auth/signin");
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

  console.log("friendships", friendships);

  const friends = friendships
    .map((friendship) => {
      if (friendship.user1Id === session.user.id) {
        return friendship.user2;
      }
      return friendship.user1;
    })
    .filter(
      (user): user is NonNullableUser =>
        user.name != null && user.email != null,
    );

  console.log("friends", friends);

  return (
    <UserList
      users={friends}
      actionCell={(user) => (
        <button>
          <TrashIcon className={"h-4 -mb-1"} />
        </button>
      )}
    />
  );
}
