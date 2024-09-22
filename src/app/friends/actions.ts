"use server";

"@/lib/db";
import { auth } from "@/auth";

export async function sendFriendRequest(userId: string) {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  await db.friendship.create({
    data: {
      user1Id: session.user.id,
      user2Id: userId,
    },
  });
}

export async function acceptFriendRequest(userId: string) {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const friendship = await db.friendship.findFirst({
    where: {
      user1Id: userId,

      user2Id: session.user.id,
    },
  });

  if (!friendship) {
    throw new Error("Friendship not found");
  }

  await db.friendship.update({
    where: {
      id: friendship.id,
    },
    data: {
      status: "accepted",
    },
  });
}

export async function removeFriend(userId: string) {
  // check authentication
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }

  // find friendship

  const friendship = await db.friendship.findFirst({
    where: {
      OR: [
        {
          user1Id: session.user.id,
          user2Id: userId,
        },
        {
          user1Id: userId,

          user2Id: session.user.id,
        },
      ],
    },
  });

  if (!friendship) {
    throw new Error("Friendship not found");
  }

  await db.friendship.delete({
    where: {
      id: friendship.id,
    },
  });
}
