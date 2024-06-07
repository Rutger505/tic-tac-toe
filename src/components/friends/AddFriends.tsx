"use client";

import UserList from "@/components/friends/UserList";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { useState } from "react";
import SearchBar from "@/components/friends/SearchBar";

export function AddFriends() {
  const [search, setSearch] = useState("");

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
    <>
      <SearchBar value={search} onChange={setSearch} />
      <UserList
        users={users}
        actionCell={(user) => (
          <button>
            <TrashIcon className={"h-4 -mb-1"} />
            {search}
          </button>
        )}
      />
    </>
  );
}
