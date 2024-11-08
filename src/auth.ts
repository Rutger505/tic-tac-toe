import Google from "@auth/core/providers/google";
import {PrismaAdapter} from "@auth/prisma-adapter";
import db from "@/lib/db";
import NextAuth, {type DefaultSession} from "next-auth";
import {User} from "@/types/user";
import Credentials from "@auth/core/providers/credentials";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User & DefaultSession["user"];
  }
}

const isProduction = process.env.ENVIRONMENT === "production";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
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
    Credentials({
      name: "credentials",
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"}
      },
     async authorize(credentials) {
        // For testing - create a mock user with the provided credentials
        const user = {
          id: "test-user-" + Math.random().toString(36),
          email: credentials?.email || "test@example.com",
          image: "https://www.gravatar.com/avatar/",
          name: "Test User",
        };

        return user as User;
      },
    }),
  ],
  callbacks: {
    session: async ({session, user}) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
  },
  debug: !isProduction,
});
