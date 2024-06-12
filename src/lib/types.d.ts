interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
}

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  type JWT = User;
}
