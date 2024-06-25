import { Button } from "@/components/ui/button";
import Leaderboard from "@/components/homepage/leaderboard";
import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="grid grid-cols-2">
      <div className={"flex flex-col gap-28 mt-48 mx-auto"}>
        <h1 className={"font-bold text-6xl"}>Tic-tac-toe</h1>
        <div className={"flex gap-8"}>
          <Button className={"rounded-md px-4 h-14 text-2xl font-medium"}>
            <Link href={session ? "/play" : "/api/auth/signin"}>
              Quick play
            </Link>
          </Button>
          <Button
            variant={"outline"}
            className={"rounded-md px-4 h-14 text-2xl font-medium"}
          >
            Play with friend
          </Button>
        </div>
      </div>
      <Leaderboard />
    </main>
  );
}
