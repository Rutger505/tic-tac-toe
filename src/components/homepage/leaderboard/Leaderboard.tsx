"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardList from "@/components/homepage/leaderboard/LeaderboardList";

export default function Leaderboard() {
  const demoUsers = [
    {
      id: "1",
      name: "Alice",
      wins: 10,
      winPercentage: 5.0,
      position: 1,
    },
    {
      id: "2",
      name: "Bob",
      wins: 5,
      winPercentage: 25.0,
      position: 2,
    },
    {
      id: "3",
      name: "Charlie",
      wins: 20,
      winPercentage: 50.0,
      position: 3,
    },
    {
      id: "4",
      name: "David",
      wins: 15,
      winPercentage: 30.0,
      position: 4,
    },
    {
      id: "5",
      name: "Eva",
      wins: 8,
      winPercentage: 16.0,
      position: 5,
    },
    {
      id: "6",
      name: "Frank",
      wins: 12,
      winPercentage: 24.0,
      position: 6,
    },
    {
      id: "7",
      name: "Grace",
      wins: 7,
      winPercentage: 14.0,
      position: 7,
    },
    {
      id: "8",
      name: "Hannah",
      wins: 25,
      winPercentage: 62.5,
      position: 8,
    },
    {
      id: "9",
      name: "Ivan",
      wins: 9,
      winPercentage: 18.0,
      position: 9,
    },
    {
      id: "10",
      name: "Judy",
      wins: 13,
      winPercentage: 26.0,
      position: 10,
    },
  ];
  const currentUser = {
    id: "1123",
    position: 6532,
    name: "You",
    wins: 0,
    winPercentage: 0.0,
  };

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
          <LeaderboardList users={demoUsers} currentUser={currentUser} />
        </TabsContent>
        <TabsContent value="weekly" className={"max-h-80 overflow-y-auto"}>
          <LeaderboardList users={demoUsers} currentUser={currentUser} />
        </TabsContent>
        <TabsContent value="all-time" className={"max-h-80 overflow-y-auto"}>
          <LeaderboardList users={demoUsers} currentUser={currentUser} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
