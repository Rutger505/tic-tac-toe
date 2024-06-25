"use client";

import UserList from "@/components/friends/UserList";
import SearchBar from "@/components/friends/SearchBar";
import { TimerIcon } from "@/components/icons/TimerIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { useState } from "react";
import { CheckIcon } from "lucide-react";

interface CurrentFriendsFormProps {
  users: User[];
  friendShips: {
    id: string;
    status: string;
    user1Id: string;
    user2Id: string;
    createdAt: Date;
  }[];
}

export default function AddFriendsForm({
  users,
  friendShips,
}: Readonly<CurrentFriendsFormProps>) {
  const [search, setSearch] = useState("");

  return (
    <>
      <SearchBar value={search} onChange={setSearch} />
      <UserList
        users={users}
        actionCell={(user) =>
          // If user is already friend show CheckIcon
          // else if user is friend request pending show TimerIcon
          // else if user is not friend show PlusIcon
          friendShips.some((friendShip) => {
            return (
              (friendShip.user1Id === user.id ||
                friendShip.user2Id === user.id) &&
              friendShip.status === "accepted"
            );
          }) ? (
            <CheckIcon className={"h-4 ml-1"} />
          ) : friendShips.some((friendShip) => {
              return (
                (friendShip.user1Id === user.id ||
                  friendShip.user2Id === user.id) &&
                friendShip.status === "pending"
              );
            }) ? (
            <TimerIcon className={"h-5"} />
          ) : (
            <PlusIcon className={"h-4 ml-1"} />
          )
        }
      />
    </>
  );
}
