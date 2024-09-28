"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardList, {
  LeaderboardUser,
} from "@/components/homepage/leaderboard/LeaderboardList";
import { useEffect, useState } from "react";
import { getLeaderboard } from "@/app/actions";

interface Leaderboard {
  top10DailyUsers: LeaderboardUser[];
  top10WeeklyUsers: LeaderboardUser[];
  top10AllTimeUsers: LeaderboardUser[];
  currentUserDailyStats: LeaderboardUser | null;
  currentUserWeeklyStats: LeaderboardUser | null;
  currentUserAllTimeStats: LeaderboardUser | null;
}

interface Props {
  defaultLeaderboard: Leaderboard;
}

export default function Leaderboard({ defaultLeaderboard }: Readonly<Props>) {
  const [leaderboard, setLeaderboard] = useState(defaultLeaderboard);

  async function refreshLeaderboard() {
    setLeaderboard(await getLeaderboard());
  }

  useEffect(() => {
    refreshLeaderboard();
  }, []);

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
            users={leaderboard.top10DailyUsers}
            currentUser={leaderboard.currentUserDailyStats}
          />
        </TabsContent>
        <TabsContent value="weekly" className={"max-h-80 overflow-y-auto"}>
          <LeaderboardList
            users={leaderboard.top10WeeklyUsers}
            currentUser={leaderboard.currentUserWeeklyStats}
          />
        </TabsContent>
        <TabsContent value="all-time" className={"max-h-80 overflow-y-auto"}>
          <LeaderboardList
            users={leaderboard.top10AllTimeUsers}
            currentUser={leaderboard.currentUserAllTimeStats}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
