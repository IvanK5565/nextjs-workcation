import { NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { TimesInMS, UserStatus } from "@/constants";
import IContextContainer from "@/server/container/IContextContainer";
import i18 from "@/public/locales/en-US";
import { IIdentity } from "@/acl/types";
import { encode as defaultEncode } from "next-auth/jwt";
import { randomUUID } from "crypto";
import { ApiError } from "../exceptions";
import { StatusCodes } from "http-status-codes";
import { AnswerType } from "@/types";
import { Logger } from "../logger";

export default function authOptionsContainer(ctx: IContextContainer) {
	const log = ctx.Logger.log;
	const authOptions = {
		debug:true,
		adapter:ctx.adapter,
		providers: [
			GitHub({
				clientId: process.env.AUTH_GITHUB_ID!,
				clientSecret: process.env.AUTH_GITHUB_SECRET!
			}),
			Credentials({
				credentials: {
					email: { label: i18.EmailLabel, type: "email" },
					password: { label: i18.PasswordLabel, type: "password" },
				},
				async authorize(credentials) {
					if (!credentials) return null;
					const user = await ctx.UserModel.findOne({
						where: {
							email: credentials.email,
							status: UserStatus.ACTIVE,
						},
					});
					
					if (!user) return null;
					const passVerified = await user.verifyPassword(credentials.password);
					console.log("auth pass:",passVerified)
					if (!passVerified) return null;
					
					return { ...user.get(), id: user.id.toString() };
				},
			}),
		],
		callbacks: {
			async jwt({ account, token, user }) {
				if(account?.provider === 'credentials'){
					token.credentials = true;
				}
				if(user) token.user = user as IIdentity;
				return token
			},
			async session({session, user}) {
				session.user = user as unknown as IIdentity;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				session.acl = (user as any).acl
				// Logger.log('session:', session, user);
				return session
			},
		},
		jwt:{
			encode: async (param)=>{
				if(param.token?.credentials){
					const sessionToken = randomUUID();

					log('param.token.sub',param.token.sub)
					if(!param.token.sub){
						throw new ApiError('No user ID found in token', StatusCodes.INTERNAL_SERVER_ERROR, AnswerType.Toast)
					}

					const createdSession = await ctx.adapter.createSession?.({
						sessionToken:sessionToken,
						userId: param.token.sub,
						expires: new Date(Date.now() + TimesInMS.DAY*30),
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

