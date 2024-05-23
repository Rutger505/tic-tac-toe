import { Button } from "@/components/ui/button";
import Leaderboard from "@/components/homepage/leaderboard";

export default function Home() {
  return (
    <main className="flex p-56">
      <div className={"flex flex-col gap-28 justify-center -mt-36"}>
        <h1 className={"font-bold text-7xl"}>Tic-tac-toe</h1>
        <div className={"flex gap-8"}>
          <Button className={"rounded-md px-4 h-14 text-2xl font-medium"}>
            Quick play
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
