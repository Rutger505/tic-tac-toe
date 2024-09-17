import db from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FriendInvitationsForm from "@/components/friends/FriendInvitationsForm";
import { User } from "@/types/user";

export default async function FriendInvitations() {
  const session = await auth();
  if (!session) {
    return redirect("/");
  }

  const invitations = await db.friendship.findMany({
    where: {
      status: "pending",
      user2Id: session.user.id,
    },
    include: {
      user1: true,
      user2: true,
    },
  });

  const invitationUsers = invitations
    .map((invitation) => {
      if (!("user1" in invitation) || !("user2" in invitation)) {
        throw new Error("Invitation is missing user1 or user2");
      }

      if (invitation.user1Id === session.user.id) {
        return {
          id: invitation.user2.id,
          name: invitation.user2.name ?? undefined,
          email: invitation.user2.email ?? undefined,
          image: invitation.user2.image ?? undefined,
        };
      }
      return {
        id: invitation.user1.id,
        name: invitation.user1.name ?? undefined,
        email: invitation.user1.email ?? undefined,
        image: invitation.user1.image ?? undefined,
      };
    })
    .filter(
      (user): user is User =>
        !!user.id && !!user.name && !!user.email && !!user.image,
    );

  return <FriendInvitationsForm users={invitationUsers} />;
}
