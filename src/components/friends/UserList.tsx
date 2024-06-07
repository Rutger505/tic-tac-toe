import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ReactNode } from "react";

interface UserListProps {
  users: User[];
  actionCell: (user: User) => ReactNode;
}

export default function UserList({
  users,
  actionCell,
}: Readonly<UserListProps>) {
  return (
    <Table className={"w-fit"}>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className={"font-medium min-w-72"}>
              {user.name}
            </TableCell>
            <TableCell>{actionCell(user)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
