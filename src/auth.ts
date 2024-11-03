import Google from "@auth/core/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";
import NextAuth, { type DefaultSession } from "next-auth";
import { User } from "@/types/user";
import Credentials from "@auth/core/providers/credentials";
import { createHash } from "@auth/core/lib/utils/web";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    process.env.NODE_ENV === "production"
      ? Google({
          profile(profile) {
            return {
              id: profile.sub,
              name: profile.name,
              email: profile.email,
              image: profile.picture,
            };
          },
        })
      : Credentials({
          name: "Development",
          credentials: {
            username: { label: "Username", type: "text", required: true },
            password: { label: "Password", type: "password", required: true },
          },
          async authorize(credentials) {
            const id = await createHash(credentials.username);

            return {
              id: id,
              name: `${credentials.username}`,
              email: `${credentials.username}@example.com`,
              image: "https://placehold.co/64x64",
            };
          },
        }),
  ],
});
