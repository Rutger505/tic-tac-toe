import db from "@/lib/db";
import { User } from "@/types/user";

interface Query {
  where?: FindArgs;
}

interface FindArgs {
  id?: string;
  email?: string;
  name?: string;
}

function isUser(user: any): user is User {
  return user.name !== null && user.email !== null && user.image !== null;
}

export async function getUsers({ where }: Query = {}): Promise<User[]> {
  return (
    await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      where: {
        name: {
          not: null,
        },
        email: {
          not: null,
        },
        image: {
          not: null,
        },
        ...where,
      },
    })
  )
    .map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    }))
    .filter(isUser);
}

export async function getUser({ where }: Query): Promise<User | null> {
  const user = await db.user.findFirst({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
    where: {
      name: {
        not: null,
      },
      email: {
        not: null,
      },
      image: {
        not: null,
      },
      ...where,
    },
  });

  if (!user) return null;

  if (!isUser(user)) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  };
}
