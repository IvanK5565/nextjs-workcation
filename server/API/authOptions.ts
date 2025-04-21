import { NextAuthOptions } from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { UserRole, UserStatus } from "@/server/utils/constants";
import IContextContainer from "../IContextContainer";
import { UsersType } from "../models/users";

declare module 'next-auth' {
  interface User extends UsersType {}
}

export default function authOptionsContainer(ctx: IContextContainer) {
  const authOptions = {
    // Configure one or more authentication providers  
    providers: [
      GitHub({
        clientId: process.env.AUTH_GITHUB_ID!,
        clientSecret: process.env.AUTH_GITHUB_SECRET!,
      }),
      Credentials({
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials) return null;
          let user = await ctx.UsersModel.findOne({
            where: {
              email: credentials.email,
              status: UserStatus.ACIVE,
            }
          });

          if (!user) return null;
          if (user.password != credentials.password) return null;

          return {...user.get({plain:true})}
        }
      })
      // ...add more providers here
    ],
    session: {
      strategy: 'jwt',
    },
    callbacks: {
      async signIn({ user, account, profile }) {
        if (account?.provider === 'github') {
          let exitingUser = await ctx.UsersModel.findOne({
            where: {
              email: profile?.email,
              status: UserStatus.ACIVE,
            }
          });

          return exitingUser != null;
        }
        return true;
      },
      async jwt({ token, user }) {
        if (user) {
          token = {...user};
        }
        // console.log(token)
        return token;
      },
      async session({ session, token }) {
        if (token) {
          session.user = token;
        }
        return session;
      }
    },
    pages: {
      signIn: '/signIn',
    },
    secret: process.env.AUTH_SECRET!,
  } satisfies NextAuthOptions;

  return authOptions;
}