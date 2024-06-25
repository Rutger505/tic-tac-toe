"use server";

import db from "@/lib/db";
import { auth } from "@/auth";

export async function sendFriendRequest(userId: string) {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const result = await db.friendship.create({
    data: {
      user1Id: session.session.user.id,
      user2Id: userId,
    },
  });
}
