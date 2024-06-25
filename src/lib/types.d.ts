interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: Date;
  image: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  type JWT = User;
}
