import { NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { UserStatus } from "@/constants";
import IContextContainer from "@/server/container/IContextContainer";
import i18 from "@/public/locales/en-US";
import { IIdentity } from "@/acl/types";
import { encode as defaultEncode } from "next-auth/jwt";
import { randomUUID } from "crypto";
import { ApiError } from "../exceptions";
import { StatusCodes } from "http-status-codes";
import { AnswerType } from "@/types";

export default function authOptionsContainer(ctx: IContextContainer) {
	const authOptions = {
		// Configure one or more authentication providers
		providers: [
			// GitHub({
			// 	clientId: process.env.AUTH_GITHUB_ID!,
			// 	clientSecret: process.env.AUTH_GITHUB_SECRET!,
			// }),
			Credentials({
				credentials: {
					email: { label: i18.EmailLabel, type: "email" },
					password: { label: i18.PasswordLabel, type: "password" },
				},
				async authorize(credentials) {
					if (!credentials) return null;
					let user = await ctx.UserModel.findOne({
						where: {
							email: credentials.email,
							status: UserStatus.ACTIVE,
						},
					});
					
					if (!user) return null;
					const passVerified = await user.verifyPassword(credentials.password);
					console.log("auth pass:",passVerified)
					if (!passVerified) return null;
					
					return { id: user.id.toString(), email:user.email, name:user.firstName, role:user.role };
				},
			}),
			// ...add more providers here
		],
		// session: {
		// 	strategy: "jwt",
		// },
		adapter:ctx.adapter,
		callbacks: {
			async signIn({ user, account, profile }) {
				if (account?.provider === "github") {
					let exitingUser = await ctx.UserModel.findOne({
						where: {
							email: profile?.email,
							status: UserStatus.ACTIVE,
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
				if(account?.provider === 'credentials'){
					token.credentials = true;
				}
				if(user) token.user = user as IIdentity;
				return token
			},
			async session({session, user}) {
				session.user = user as unknown as IIdentity;
				// session.accessToken = token.accessToken;
				console.log('session: ', session)
				return session
			},
		},
		jwt:{
			encode: async function(param){
				if(param.token?.credentials){
					const sessionToken = randomUUID();

					if(!param.token.sub){
						throw new ApiError('No user ID found in token', StatusCodes.INTERNAL_SERVER_ERROR, AnswerType.Toast)
					}

					const createdSession = await ctx.adapter.createSession?.({
						sessionToken:sessionToken,
						userId: param.token.sub,
						expires: new Date(Date.now() + 30*24*60*60*1000),
					})
					if(!createdSession){
						throw new ApiError('Failed to create session', StatusCodes.INTERNAL_SERVER_ERROR, AnswerType.Toast)
					}
					return sessionToken;
				}
				return defaultEncode(param);
			}
		},
		pages: {
			signIn: "/signIn",
		},
		secret: process.env.AUTH_SECRET!,
	} satisfies NextAuthOptions;

	return authOptions;
}

