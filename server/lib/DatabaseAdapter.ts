/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Adapter,
	AdapterUser,
	AdapterAccount,
	AdapterSession,
} from "next-auth/adapters";
import { RedisClientType } from "redis";
import IContextContainer from "@/server/container/IContextContainer";
import { ROLE } from "@/acl/types";
import { UserStatus } from "@/constants";
import { ApiError } from "../exceptions";
import { AnswerType } from "@/types";
import Acl from "@/acl/Acl";

const options = {
	accountKeyPrefix: "user:account:",
	accountByUserIdPrefix: "user:account:by-user-id:",
	emailKeyPrefix: "user:email:",
	sessionKeyPrefix: "user:session:",
	sessionByUserIdKeyPrefix: "user:session:by-user-id:",
	userKeyPrefix: "user:",
	verificationTokenKeyPrefix: "user:token:",
};

function hydrateDates(json: object) {
	return Object.entries(json).reduce((acc, [key, val]) => {
		acc[key] = key === "expires" ? new Date(val) : val;
		return acc;
	}, {} as any);
}

export function DatabaseAdapter(ctx: IContextContainer): Adapter {
	const client: RedisClientType = ctx.redis;
	const {
		accountKeyPrefix,
		accountByUserIdPrefix,
		emailKeyPrefix,
		sessionKeyPrefix,
		sessionByUserIdKeyPrefix,
		userKeyPrefix,
	} = options;

	const setObjectAsJson = (key: string, obj: any) =>
		client.set(key, JSON.stringify(obj));
	const getObject = async <T>(key: string): Promise<T | null> => {
		const sObj = await client.get(key);
		const obj: T | null = sObj == null ? sObj : JSON.parse(sObj);
		return obj;
	};

	const setAccount = async (id: string, account: AdapterAccount) => {
		const accountKey = accountKeyPrefix + id;
		await setObjectAsJson(accountKey, account);
		await client.set(accountByUserIdPrefix + account.userId, accountKey);
		ctx.Logger.log("setAccount id account", id, account);
		return account;
	};

	const getAccount = async (id: string) => {
		const sAccount = await client.get(accountKeyPrefix + id);
		const account: AdapterAccount = JSON.parse(sAccount!);
		if (!account) return null;
		ctx.Logger.log("getAccount", account);
		return hydrateDates(account);
	};

	const setSession = async (
		id: string,
		session: any
	): Promise<AdapterSession> => {
		const sessionKey = sessionKeyPrefix + id;
		const user = await ctx.UserModel.findByPk(session.userId);
		if (user) {
			const acl = ctx.cleaner.cleanRolesAndRules(new Acl(ctx.roles, ctx.rules), user.role);
			await setObjectAsJson(sessionKey, { ...session, acl });
		}
		await client.set(sessionByUserIdKeyPrefix + session.userId, sessionKey);
		ctx.Logger.log("adapter:setsession: ", await client.get(sessionKey));
		return session;
	};

	const getSession = async (id: string) => {
		const session = await getObject<AdapterSession>(sessionKeyPrefix + id);
		if (!session) return null;
		return hydrateDates(session);
	};

	const setUser = async (
		id: string,
		user: AdapterUser
	): Promise<AdapterUser> => {
		ctx.Logger.log("setUser:", id, user);
		await setObjectAsJson(userKeyPrefix + id, user);
		await client.set(`${emailKeyPrefix}${user.email}`, id);
		return { ...user, id };
	};

	const getUser = async (id: string) => {
		const userAdapter = await getObject<AdapterUser>(userKeyPrefix + id);
		if (!userAdapter) return null;
		const user = await ctx.UserModel.findByPk(userAdapter.id);
		ctx.Logger.log("getUserById", id, userAdapter, user);
		return user?.get();
	};

	return {
		createUser: async (user: any) => {
			ctx.Logger.log("createUser", user);
			let id = await ctx.UserModel.findOne({
				where: { email: user.email },
			}).then((user) => user?.id);
			if (!id) {
				try {
					const names = user.name?.split(" ");
					id = await ctx.UserModel.build()
						.set({
							firstName: names?.[0] ?? "Unknown",
							lastName: names?.[1] ?? null,
							email: user.email,
							role: user.role ?? ROLE.GUEST,
							emailVerified: user.emailVerified,
							status: UserStatus.ACTIVE,
						})
						.save()
						.then((user) => user.id);
				} catch (e) {
					ctx.Logger.error("Error saving user: ", (e as Error).message);
					throw new ApiError("Error saving user", 500, AnswerType.Toast);
				}
			}
			if (!id) {
				throw new ApiError("Error saving user", 500, AnswerType.Toast);
			}

			return await setUser(id.toString(), user);
		},
		getUser,
		async getUserByEmail(email) {
			const userId = await client.get(emailKeyPrefix + email);
			if (!userId) {
				return null;
			}
			ctx.Logger.log("getUserByEmail", email, userId, await getUser(userId));
			return await getUser(userId);
		},
		async getUserByAccount(account) {
			const dbAccount = await getAccount(
				`${account.provider}:${account.providerAccountId}`
			);
			if (!dbAccount) return null;
			ctx.Logger.log(
				"getuserbyaccount",
				dbAccount,
				await getUser(dbAccount.userId)
			);
			return await getUser(dbAccount.userId);
		},
		async updateUser(updates) {
			const userId = updates.id as string;
			const user = await getUser(userId);
			return await setUser(userId, { ...(user as AdapterUser), ...updates });
		},
		async linkAccount(account: AdapterAccount) {
			const id = `${account.provider}:${account.providerAccountId}`;
			return await setAccount(id, { ...account, id });
		},
		createSession: (session) => setSession(session.sessionToken, session),
		async getSessionAndUser(sessionToken) {
			const session = await getSession(sessionToken);
			if (!session) return null;
			const dbUser = await ctx.UserModel.findByPk(session.userId);
			if (!dbUser) return null;
			const user = {
				...dbUser.get(),
				id: dbUser.id.toString(),
			};
			const acl = session.acl;
			// ctx.Logger.log('getSessionAndUser',session)
			return { session, user:{...user, acl} };
		},
		async updateSession(updates) {
			const session = await getSession(updates.sessionToken);
			if (!session) return null;
			return await setSession(updates.sessionToken, { ...session, ...updates });
		},
		async deleteSession(sessionToken) {
			ctx.Logger.log("deleteSession");
			await client.del(sessionKeyPrefix + sessionToken);
		},
		// async createVerificationToken(verificationToken) {
		// 	await setObjectAsJson(
		// 		verificationTokenKeyPrefix +
		// 			verificationToken.identifier +
		// 			":" +
		// 			verificationToken.token,
		// 		verificationToken
		// 	);
		// 	return verificationToken;
		// },
		// async useVerificationToken(verificationToken) {
		// 	const tokenKey =
		// 		verificationTokenKeyPrefix +
		// 		verificationToken.identifier +
		// 		":" +
		// 		verificationToken.token;

		// 	const token = await getObject<VerificationToken>(tokenKey);
		// 	if (!token) return null;

		// 	await client.del(tokenKey);
		// 	return hydrateDates(token);
		// 	// return reviveFromJson(token)
		// },
		// async unlinkAccount(account:AdapterAccount) {
		// 	const id = `${account.provider}:${account.providerAccountId}`;
		// 	const dbAccount = await getAccount(id);
		// 	if (!dbAccount) return;
		// 	const accountKey = `${accountKeyPrefix}${id}`;
		// 	await client.del([
		// 		accountKey,
		// 		`${accountByUserIdPrefix} + ${dbAccount.userId as string}`,
		// 	]);
		// },
		// async deleteUser(userId) {
		// 	const user = await getUser(userId);
		// 	if (!user) return;
		// 	const accountByUserKey = accountByUserIdPrefix + userId;
		// 	const accountKey = await client.get(accountByUserKey);
		// 	const sessionByUserIdKey = sessionByUserIdKeyPrefix + userId;
		// 	const sessionKey = await client.get(sessionByUserIdKey);
		// 	await client.del([
		// 		userKeyPrefix + userId,
		// 		`${emailKeyPrefix}${user.email as string}`,
		// 		accountKey as string,
		// 		accountByUserKey,
		// 		sessionKey as string,
		// 		sessionByUserIdKey,
		// 	]);
		// },
	};
}