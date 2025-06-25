import { NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { TimesInMS, UserStatus } from "@/constants";
import IContextContainer from "@/server/container/IContextContainer";
import { IIdentity } from "@/acl/types";
import { encode as defaultEncode } from "next-auth/jwt";
import { randomUUID } from "crypto";
import { ApiError } from "../exceptions";
import { StatusCodes } from "http-status-codes";
import { AnswerType } from "@/types";
import { Logger } from "../logger";
import { guestRulesNRoles } from "../utils";

export default function authOptionsContainer({UserModel,adapter,rules,roles}: IContextContainer) {
	const log = Logger.log;
	const authOptions = {
		debug:true,
		adapter,
		providers: [
			GitHub({
				clientId: process.env.AUTH_GITHUB_ID!,
				clientSecret: process.env.AUTH_GITHUB_SECRET!
			}),
			Credentials({
				credentials: {
					email: { label: 'EmailLabel', type: "email" },
					password: { label: 'PasswordLabel', type: "password" },
				},
				async authorize(credentials) {
					if (!credentials) return null;
					const user = await UserModel.findOne({
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
				Logger.info('Seesion callback', session);
				session.identity = user as unknown as IIdentity;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				session.acl = (user as any).acl ?? guestRulesNRoles(rules,roles);
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

					const createdSession = await adapter.createSession?.({
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

