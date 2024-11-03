import Google from "@auth/core/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";
import NextAuth, { type DefaultSession } from "next-auth";
import { User } from "@/types/user";
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
    isProduction
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
            const data = new TextEncoder().encode(
              credentials.username as string,
            );
            const hash = await crypto.subtle.digest("SHA-256", data);
            const id = Array.from(new Uint8Array(hash)).join("");

            const user = await db.user.upsert({
              where: { email: `${credentials.username}@example.com` },
              update: {},
              create: {
                id: id,
                name: credentials.username,
                email: `${credentials.username}@example.com`,
                image: "https://placehold.co/64x64",
              },
            });

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            };
          },
        }),
  ],
  debug: !isProduction,
});
