"use client";

import UserList from "@/components/friends/UserList";
import SearchBar from "@/components/friends/SearchBar";
import { TimerIcon } from "@/components/icons/TimerIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { useState } from "react";
import { CheckIcon } from "lucide-react";
import { sendFriendRequest } from "@/app/friends/actions";
import { User } from "@/types/user";

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

  const getFriendshipIcon = (user: User) => {
    const friendship = friendShips.find(
      (friendShip) =>
        friendShip.user1Id === user.id || friendShip.user2Id === user.id,
    );

    if (!friendship) {
      return (
        <button onClick={() => sendFriendRequest(user.id)}>
          <PlusIcon className={"h-4 ml-1"} />
        </button>
      );
    }

    if (friendship.status === "pending") {
      return <TimerIcon className={"h-4 ml-1"} />;
    }

    return <CheckIcon className={"h-4 ml-1"} />;
  };

  return (
    <>
      <SearchBar value={search} onChange={setSearch} />
      <UserList users={users} actionCell={(user) => getFriendshipIcon(user)} />
    </>
  );
}
