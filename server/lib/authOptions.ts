import { NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { UserStatus } from "@/server/utils/constants";
import IContextContainer from "../IContextContainer";
import { verifyPassword } from "../utils";

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
						},
					});
					
					if (!user) return null;
					const passVerified = await verifyPassword(credentials.password, user.password);
					console.log("auth pass:",passVerified)
					if (!passVerified) return null;
					
					return { id: user.id.toString(), email:user.email, name:user.first_name, role:user.role };
				},
			}),
			// ...add more providers here
		],
		session: {
			strategy: "jwt",
		},
		callbacks: {
			async signIn({ user, account, profile }) {
				if (account?.provider === "github") {
					let exitingUser = await ctx.UsersModel.findOne({
						where: {
							email: profile?.email,
							status: UserStatus.ACIVE,
						},
					});
					return exitingUser != null;
				}
				return true;
			},
			async jwt({ account, token, user }) {
				if (account) {
					token.accessToken = account.access_token
				}
				if(user) token.user = user;
				return token
			},
			async session({ session, token, user }) {
				session.user = token.user!;
				session.accessToken = token.accessToken;
				console.log('session: ', session)
				return session
			},
		},
		pages: {
			signIn: "/signIn",
		},
		secret: process.env.AUTH_SECRET!,
	} satisfies NextAuthOptions;

	return authOptions;
}

