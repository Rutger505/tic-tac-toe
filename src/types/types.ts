export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: Date;
  image: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum GameState {
  Ongoing,
  Draw,
  XWins,
  OWins,
  Cancelled,
}

export enum PlayerSymbol {
  X,
  O,
}

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  type JWT = User;
}
