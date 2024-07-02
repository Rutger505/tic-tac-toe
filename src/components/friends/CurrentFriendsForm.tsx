"use client";

import { TrashIcon } from "@/components/icons/TrashIcon";
import UserList from "@/components/friends/UserList";
import { removeFriend } from "@/app/friends/actions";
import { User } from "@/types/types";

interface CurrentFriendsFormProps {
  users: User[];
}

export default function CurrentFriendsForm({
  users,
}: Readonly<CurrentFriendsFormProps>) {
  return (
    <UserList
      users={users}
      actionCell={(user) => (
        <button onClick={() => removeFriend(user.id)}>
          <TrashIcon className={"h-4 -mb-1"} />
        </button>
      )}
    />
  );
}
