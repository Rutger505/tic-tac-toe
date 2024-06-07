import UserList from "@/components/friends/UserList";
import { PlusIcon } from "@/components/icons/PlusIcon";

export default function FriendInvitations() {
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
          <PlusIcon className={"h-4 ml-1"} />
        </button>
      )}
    />
  );
}
