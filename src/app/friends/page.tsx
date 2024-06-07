import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurrentFriends } from "@/components/friends/CurrentFriends";
import { AddFriends } from "@/components/friends/AddFriends";

export default function Friends() {
  return (
    <main className="flex flex-col items-center mt-16 gap-10">
      <h1 className={"font-bold text-4xl"}>Friends</h1>

      <Tabs defaultValue="friends">
        <TabsList className={"w-full"}>
          <TabsTrigger
            value="friends"
            className={
              "data-[state=active]:bg-muted rounded-sm data-[state=active]:border-0"
            }
          >
            Friends
          </TabsTrigger>
          <TabsTrigger
            value="add-friends"
            className={
              "data-[state=active]:bg-muted rounded-sm data-[state=active]:border-0"
            }
          >
            Add friends
          </TabsTrigger>
        </TabsList>
        <TabsContent value={"friends"} className={"mt-4"}>
          <CurrentFriends />
        </TabsContent>
        <TabsContent value={"add-friends"} className={"mt-4"}>
          <AddFriends />
        </TabsContent>
      </Tabs>
    </main>
  );
}
