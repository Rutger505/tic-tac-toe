"use client";

import UserList from "@/components/friends/UserList";
import { useState } from "react";
import SearchBar from "@/components/friends/SearchBar";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { TimerIcon } from "@/components/icons/TimerIcon";

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
        users={users.filter((user) =>
          user.name.toLowerCase().includes(search.toLowerCase()),
        )}
        actionCell={(user) => (
          <button className={"flex items-center justify-center"}>
            {Math.random() > 0.5 ? (
              <TimerIcon className={"h-5"} />
            ) : (
              <PlusIcon className={"h-5 ml-1"} />
            )}
          </button>
        )}
      />
    </>
  );
}
