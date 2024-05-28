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
}

interface LeaderboardListProps {
  users: LeaderboardUser[];
}

export default function LeaderboardList({
  users,
}: Readonly<LeaderboardListProps>) {
  return (
    <Table className={"w-fit"}>
      <TableHeader>
        <TableRow>
          <TableCell></TableCell>
          <TableCell className={"w-52"}>Player</TableCell>
          <TableCell className={"w-20"}>Wins</TableCell>
          <TableCell className={"w-20"}>Win%</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <TableRow key={user.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.wins}</TableCell>
            <TableCell>{user.winPercentage}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
