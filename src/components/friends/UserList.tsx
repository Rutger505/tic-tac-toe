import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ReactNode } from "react";
import Image from "next/image";
import { User } from "@/types/user";

interface UserListProps {
  users: User[];
  actionCell: (user: User) => ReactNode;
}

export default function UserList({
  users,
  actionCell,
}: Readonly<UserListProps>) {
  return (
    <Table>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <Image
                src={user.image ?? "/avatar-placeholder.webp"}
                alt={user.name}
                width={32}
                height={32}
                className={"rounded-full"}
              />
            </TableCell>
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
