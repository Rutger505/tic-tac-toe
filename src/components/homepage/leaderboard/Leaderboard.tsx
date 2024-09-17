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
      return gameDate.toDateString() === now.toDateString();
    } else if (period === "weekly") {
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
      return gameDate >= oneWeekAgo;
    } else {
      return true;
    }
  });

  const wins = gamesInPeriod.filter((game) => game.winnerId === user.id).length;
  const winPercentage =
    gamesInPeriod.length === 0
      ? 0
      : Math.round((wins / gamesInPeriod.length) * 1000) / 10;

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

  const currentUser = session
    ? await db.user.findFirst({
        where: {
          id: session?.user.id,
        },
        select: {
          id: true,
          name: true,
          gamesWon: true,
          gamesPlayerO: true,
          gamesPlayerX: true,
        },
      })
    : null;

  const top10DailyUsers = users
    .map((user) => getUserWithStats(user, "daily"))
    .slice(0, 10);
  const top10WeeklyUsers = users
    .map((user) => getUserWithStats(user, "weekly"))
    .slice(0, 10);
  const top10AllTimeUsers = users
    .map((user) => getUserWithStats(user, "all-time"))
    .slice(0, 10);

  const currentUserDailyStats =
    currentUser && !top10DailyUsers.some((user) => user.id === currentUser.id)
      ? getUserWithStats(currentUser, "daily")
      : null;

  const currentUserWeeklyStats =
    currentUser && !top10WeeklyUsers.some((user) => user.id === currentUser.id)
      ? getUserWithStats(currentUser, "weekly")
      : null;

  const currentUserAllTimeStats =
    currentUser && !top10AllTimeUsers.some((user) => user.id === currentUser.id)
      ? getUserWithStats(currentUser, "all-time")
      : null;

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
            users={top10DailyUsers}
            currentUser={currentUserDailyStats}
          />
        </TabsContent>
        <TabsContent value="weekly" className={"max-h-80 overflow-y-auto"}>
          <LeaderboardList
            users={top10WeeklyUsers}
            currentUser={currentUserWeeklyStats}
          />
        </TabsContent>
        <TabsContent value="all-time" className={"max-h-80 overflow-y-auto"}>
          <LeaderboardList
            users={top10AllTimeUsers}
            currentUser={currentUserAllTimeStats}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
