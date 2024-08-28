"use client";

import UserList from "@/components/friends/UserList";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { acceptFriendRequest } from "@/app/friends/actions";
import type { User } from "@/types/types";

interface FriendInvitationsProps {
  users: User[];
}

export default function FriendInvitationsForm({
  users,
}: Readonly<FriendInvitationsProps>) {
  return (
    <UserList
      users={users}
      actionCell={(user) => (
        <button onClick={() => acceptFriendRequest(user.id)}>
          <PlusIcon className={"h-4 ml-1"} />
        </button>
      )}
    />
  );
}
