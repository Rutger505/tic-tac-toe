import { RotatingIcon } from "@/components/play/RotatingIcon";
import { CancelButton } from "@/components/play/CancelButton";
import FriendName from "@/components/play/FriendName";

export default function QueueFriend() {
  return (
    <main className="flex flex-col items-center justify-center gap-10">
      <h1 className="text-4xl font-bold">
        Waiting for <FriendName />
      </h1>
      <RotatingIcon />
      <CancelButton />
    </main>
  );
}
