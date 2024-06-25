import { RotatingIcon } from "@/components/play/RotatingIcon";
import { CancelButton } from "@/components/play/CancelButton";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Queue } from "@/components/play/Queue";

export default async function QueuePage() {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }

  console.log("joined queue");

  return (
    <main className="flex flex-col items-center justify-center gap-10">
      <h1 className="text-4xl font-bold">Waiting for opponent</h1>
      <RotatingIcon />
      <CancelButton />
      <Queue />
    </main>
  );
}
