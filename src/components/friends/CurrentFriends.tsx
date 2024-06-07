"use client";

import UserList from "@/components/friends/UserList";
import { TrashIcon } from "@/components/icons/TrashIcon";

export function CurrentFriends() {
  const users = [
    {
      id: "idesd",
      name: "RutgerDeN00b",
      email: "jogn@email.com",
    },
    {
      id: "idasdflkjasdf;lkasdfesd",
      name: "John Doe",
      email: "asfsadf@asd.com",
    },
  ];
  return (
    <UserList
      users={users}
      actionCell={(user) => (
        <button>
          <TrashIcon className={"h-4 -mb-1"} />
        </button>
      )}
    />
  );
}
