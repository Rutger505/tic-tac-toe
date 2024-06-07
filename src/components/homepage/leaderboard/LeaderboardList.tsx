import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LeaderboardUser {
  id: string;
  name: string;
  wins: number;
  winPercentage: number;
  position: number;
}

interface LeaderboardListProps {
  users: LeaderboardUser[];
  currentUser: LeaderboardUser;
}

export default function LeaderboardList({
  users,
  currentUser,
}: Readonly<LeaderboardListProps>) {
  return (
    <Table className={"w-fit overflow-hidden"}>
      <TableHeader>
        <TableRow>
          <TableCell></TableCell>
          <TableCell className={"w-52"}>Player</TableCell>
          <TableCell className={"w-20"}>Wins</TableCell>
          <TableCell className={"w-20"}>Win%</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.position}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.wins}</TableCell>
            <TableCell>{user.winPercentage}</TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell>{currentUser.position}</TableCell>
          <TableCell>{currentUser.name}</TableCell>
          <TableCell>{currentUser.wins}</TableCell>
          <TableCell>{currentUser.winPercentage}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
