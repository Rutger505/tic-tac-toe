import { auth } from "../../auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { TrashIcon } from "@/components/icons/TrashIcon";
import UserList from "@/components/friends/UserList";

export async function CurrentFriends() {
  const session = await auth();
  if (!session) {
    return redirect("/api/auth/signin");
  }

  const friendships = await db.friendship.findMany({
    where: {
      OR: [
        { user1Id: session.session.user.id, status: "ACCEPTED" },
        { user2Id: session.session.user.id, status: "ACCEPTED" },
      ],
    },
    include: {
      user1: true,
      user2: true,
    },
  });

  const friends = friendships.map((friendship) => {
    if (friendship.user1Id === session.session.user.id) {
      return friendship.user2;
    }
    return friendship.user1;
  });

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
