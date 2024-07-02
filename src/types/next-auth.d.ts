declare module "next-auth" {
  import { User } from "@/types/types";

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  import { User } from "@/types/types";
  type JWT = User;
}
