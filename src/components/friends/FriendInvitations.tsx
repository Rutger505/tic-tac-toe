import db from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FriendInvitationsForm from "@/components/friends/FriendInvitationsForm";
import { User } from "@/types/types";

export default async function FriendInvitations() {
  const session = await auth();
  if (!session) {
    return redirect("/");
  }

  console.log(session);

  const invitations = await db.friendship.findMany({
    where: {
      status: "pending",
      // @ts-ignore
      user2Id: session.session.user.id,
    },
    include: {
      user1: true,
      user2: true,
    },
  });

  const invitationUsers = invitations
    .map((invitation) => {
      // @ts-ignore
      if (invitation.user1Id === session.session.user.id) {
        return invitation.user2;
      }
      return invitation.user1;
    })
    .filter((user): user is User => user.name != null && user.email != null);

  return <FriendInvitationsForm users={invitationUsers} />;
}
