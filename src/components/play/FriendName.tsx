"use client";

import { useParams } from "next/navigation";

export default function FriendName() {
  // String because the route does not have a spread operator
  const { friendId }: { friendId: string } = useParams();

  return <span>&lt;name of user {friendId}&gt;</span>;
}
