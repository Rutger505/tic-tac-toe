import Google from "@auth/core/providers/google";
import NextAuth, { type DefaultSession } from "next-auth";
import { User } from "@/types/user";
import { TypeORMAdapter } from "@auth/typeorm-adapter";
import { dataSourceOptions } from "@/database/datasource";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: TypeORMAdapter(dataSourceOptions),
  providers: [
    Google({
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
});
