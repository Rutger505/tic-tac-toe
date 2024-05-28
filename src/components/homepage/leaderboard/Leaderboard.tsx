import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardList from "@/components/homepage/leaderboard/LeaderboardList";

export default function Leaderboard() {
  const demoUsers = [
    {
      id: "1",
      name: "Alice",
      wins: 10,
      winPercentage: 5.0,
    },
    {
      id: "2",
      name: "Bob",
      wins: 5,
      winPercentage: 25.0,
    },
    {
      id: "3",
      name: "Charlie",
      wins: 20,
      winPercentage: 50.0,
    },
    {
      id: "4",
      name: "David",
      wins: 15,
      winPercentage: 30.0,
    },
    {
      id: "5",
      name: "Eva",
      wins: 8,
      winPercentage: 16.0,
    },
    {
      id: "6",
      name: "Frank",
      wins: 12,
      winPercentage: 24.0,
    },
    {
      id: "7",
      name: "Grace",
      wins: 7,
      winPercentage: 14.0,
    },
    {
      id: "8",
      name: "Hannah",
      wins: 25,
      winPercentage: 62.5,
    },
    {
      id: "9",
      name: "Ivan",
      wins: 9,
      winPercentage: 18.0,
    },
    {
      id: "10",
      name: "Judy",
      wins: 13,
      winPercentage: 26.0,
    },
  ];

  return (
    <div className={"mx-auto mt-24"}>
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
        <TabsContent value="daily">
          <LeaderboardList users={demoUsers} />
        </TabsContent>
        <TabsContent value="weekly">
          <LeaderboardList users={demoUsers} />
        </TabsContent>
        <TabsContent value="all-time">
          <LeaderboardList users={demoUsers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
