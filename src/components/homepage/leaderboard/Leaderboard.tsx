import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardList from "@/components/homepage/leaderboard/LeaderboardList";
import db from "@/lib/db";
import { auth } from "@/auth";

function getUserWithStats(
  user: {
    gamesPlayerO: {
      id: string;
      playerXId: string;
      playerOId: string;
      winnerId: string | null;
      state: number;
      createdAt: Date;
      updatedAt: Date;
    }[];
    gamesPlayerX: {
      id: string;
      playerXId: string;
      playerOId: string;
      winnerId: string | null;
      state: number;
      createdAt: Date;
      updatedAt: Date;
    }[];
    id: string;
    name: string | null;
    gamesWon: {
      id: string;
      playerXId: string;
      playerOId: string;
      winnerId: string | null;
      state: number;
      createdAt: Date;
      updatedAt: Date;
    }[];
  },
  period: "daily" | "weekly" | "all-time",
) {
  const games = [...user.gamesPlayerO, ...user.gamesPlayerX];
  const gamesInPeriod = games.filter((game) => {
    const now = new Date();
    const gameDate = new Date(game.createdAt);
    if (period === "daily") {
      return gameDate.getDate() === now.getDate();
    } else if (period === "weekly") {
      return gameDate.getDate() >= now.getDate() - 7;
    } else {
      return true;
    }
  });

  const wins = gamesInPeriod.filter((game) => game.winnerId === user.id).length;
  const winPercentage =
    gamesInPeriod.length === 0 ? 0 : (wins / gamesInPeriod.length) * 100;

  return {
    ...user,
    name: user.name ?? "Anonymous",
    wins,
    winPercentage,
  };
}

export default async function Leaderboard() {
  const session = await auth();

  const users = (
    await db.user.findMany({
      select: {
        id: true,
        name: true,
        gamesWon: true,
        gamesPlayerO: true,
        gamesPlayerX: true,
      },
    })
  ).sort((a, b) => b.gamesWon.length - a.gamesWon.length);

  const currentUser = await db.user.findFirst({
    where: {
      id: session.session.user.id,
    },
    select: {
      id: true,
      name: true,
      gamesWon: true,
      gamesPlayerO: true,
      gamesPlayerX: true,
    },
  });

  return (
    <div className={"mx-auto mt-16"}>
      <h2 className={"font-bold text-4xl text-center"}>Leaderboard</h2>
      <Tabs
        className={
          "w-fit mt-10 rounded-md border-2 border-black overflow-hidden"
        }
        defaultValue="daily"
      >
        <TabsList className={"w-full"}>
          <TabsTrigger className={"w-1/3"} value="daily">
            Daily
          </TabsTrigger>
          <TabsTrigger className={"w-1/3"} value="weekly">
            Weekly
          </TabsTrigger>
          <TabsTrigger className={"w-1/3"} value="all-time">
            All time
          </TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className={"max-h-80 overflow-y-auto"}>
          <LeaderboardList
            users={users.map((user) => getUserWithStats(user, "daily"))}
            currentUser={currentUser && getUserWithStats(currentUser, "daily")}
          />
        </TabsContent>
        <TabsContent value="weekly" className={"max-h-80 overflow-y-auto"}>
          <LeaderboardList
            users={users.map((user) => getUserWithStats(user, "weekly"))}
            currentUser={currentUser && getUserWithStats(currentUser, "weekly")}
          />
        </TabsContent>
        <TabsContent value="all-time" className={"max-h-80 overflow-y-auto"}>
          <LeaderboardList
            users={users.map((user) => getUserWithStats(user, "all-time"))}
            currentUser={
              currentUser && getUserWithStats(currentUser, "all-time")
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
