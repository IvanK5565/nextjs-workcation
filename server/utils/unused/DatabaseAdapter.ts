// import {
// 	type Adapter,
// 	type AdapterUser,
// 	type AdapterAccount,
// 	type AdapterSession,
// 	type VerificationToken,
// 	isDate,
// } from "@auth/core/adapters";
// import { RedisClientType } from "redis";
// import IContextContainer from "../../IContextContainer";

// const options = {
// 	accountKeyPrefix: "user:account:",
// 	accountByUserIdPrefix: "user:account:by-user-id:",
// 	emailKeyPrefix: "user:email:",
// 	sessionKeyPrefix: "user:session:",
// 	sessionByUserIdKeyPrefix: "user:session:by-user-id:",
// 	userKeyPrefix: "user:",
// 	verificationTokenKeyPrefix: "user:token:",
// };

// function hydrateDates(json: object) {
// 	return Object.entries(json).reduce((acc, [key, val]) => {
// 		acc[key] = isDate(val) ? new Date(val as string) : val;
// 		return acc;
// 	}, {} as any);
// }

// export function DatabaseAdapter(ctx: IContextContainer): Adapter {
// 	const client: RedisClientType = ctx.redis;
// 	const {
// 		accountKeyPrefix,
// 		accountByUserIdPrefix,
// 		emailKeyPrefix,
// 		sessionKeyPrefix,
// 		sessionByUserIdKeyPrefix,
// 		userKeyPrefix,
// 		verificationTokenKeyPrefix,
// 	} = options;

// 	const setObjectAsJson = (key: string, obj: any) =>
// 		client.set(key, JSON.stringify(obj));
// 	const getObject = async <T>(key: string): Promise<T | null> => {
// 		const sObj = await client.get(key);
// 		const obj: T | null = sObj == null ? sObj : JSON.parse(sObj);
// 		return obj;
// 	};

// 	const setAccount = async (id: string, account: AdapterAccount) => {
// 		const accountKey = accountKeyPrefix + id;
// 		await setObjectAsJson(accountKey, account);
// 		await client.set(accountByUserIdPrefix + account.userId, accountKey);
// 		return account;
// 	};

// 	const getAccount = async (id: string) => {
// 		const sAccount = await client.get(accountKeyPrefix + id);
// 		const account: AdapterAccount = JSON.parse(sAccount!);
// 		if (!account) return null;
// 		return hydrateDates(account);
// 	};

// 	const setSession = async (
// 		id: string,
// 		session: AdapterSession
// 	): Promise<AdapterSession> => {
// 		const sessionKey = sessionKeyPrefix + id;
// 		await setObjectAsJson(sessionKey, session);
// 		await client.set(sessionByUserIdKeyPrefix + session.userId, sessionKey);
// 		console.log("adapter:setsession: ", session);
// 		return session;
// 	};

// 	const getSession = async (id: string) => {
// 		const session = await getObject<AdapterSession>(sessionKeyPrefix + id);
// 		console.log("adapter:getsession: ", session);
// 		if (!session) return null;
// 		return hydrateDates(session);
// 	};

// 	const setUser = async (
// 		id: string,
// 		user: AdapterUser
// 	): Promise<AdapterUser> => {
// 		await setObjectAsJson(userKeyPrefix + id, user);
// 		await client.set(`${emailKeyPrefix}${user.email}`, id);
// 		return user;
// 	};

// 	const getUser = async (id: string) => {
// 		const user = await getObject<AdapterUser>(userKeyPrefix + id);
// 		if (!user) return null;
// 		return hydrateDates(user);
// 	};

// 	return {
// 		async createUser(user) {
			
// 			// const id = crypto.randomUUID();
// 			// // TypeScript thinks the emailVerified field is missing
// 			// // but all fields are copied directly from user, so it's there
// 			// return await setUser(id, { ...user, id });

// 			return await setUser(user.id, user);
// 		},
// 		getUser,
// 		async getUserByEmail(email) {
// 			const userId = await client.get(emailKeyPrefix + email);
// 			if (!userId) {
// 				return null;
// 			}
// 			return await getUser(userId);
// 		},
// 		async getUserByAccount(account) {
// 			const dbAccount = await getAccount(
// 				`${account.provider}:${account.providerAccountId}`
// 			);
// 			if (!dbAccount) return null;
// 			return await getUser(dbAccount.userId);
// 		},
// 		async updateUser(updates) {
// 			const userId = updates.id as string;
// 			const user = await getUser(userId);
// 			return await setUser(userId, { ...(user as AdapterUser), ...updates });
// 		},
// 		async linkAccount(account) {
// 			const id = `${account.provider}:${account.providerAccountId}`;
// 			return await setAccount(id, { ...account, id });
// 		},
// 		createSession: (session) => setSession(session.sessionToken, session),
// 		async getSessionAndUser(sessionToken) {
// 			const session = await getSession(sessionToken);
// 			if (!session) return null;
// 			const user = await getUser(session.userId);
// 			if (!user) return null;
// 			return { session, user };
// 		},
// 		async updateSession(updates) {
// 			const session = await getSession(updates.sessionToken);
// 			if (!session) return null;
// 			return await setSession(updates.sessionToken, { ...session, ...updates });
// 		},
// 		async deleteSession(sessionToken) {
// 			await client.del(sessionKeyPrefix + sessionToken);
// 		},
// 		async createVerificationToken(verificationToken) {
// 			await setObjectAsJson(
// 				verificationTokenKeyPrefix +
// 					verificationToken.identifier +
// 					":" +
// 					verificationToken.token,
// 				verificationToken
// 			);
// 			return verificationToken;
// 		},
// 		async useVerificationToken(verificationToken) {
// 			const tokenKey =
// 				verificationTokenKeyPrefix +
// 				verificationToken.identifier +
// 				":" +
// 				verificationToken.token;

// 			const token = await getObject<VerificationToken>(tokenKey);
// 			if (!token) return null;

// 			await client.del(tokenKey);
// 			return hydrateDates(token);
// 			// return reviveFromJson(token)
// 		},
// 		async unlinkAccount(account) {
// 			const id = `${account.provider}:${account.providerAccountId}`;
// 			const dbAccount = await getAccount(id);
// 			if (!dbAccount) return;
// 			const accountKey = `${accountKeyPrefix}${id}`;
// 			await client.del([
// 				accountKey,
// 				`${accountByUserIdPrefix} + ${dbAccount.userId as string}`,
// 			]);
// 		},
// 		async deleteUser(userId) {
// 			const user = await getUser(userId);
// 			if (!user) return;
// 			const accountByUserKey = accountByUserIdPrefix + userId;
// 			const accountKey = await client.get(accountByUserKey);
// 			const sessionByUserIdKey = sessionByUserIdKeyPrefix + userId;
// 			const sessionKey = await client.get(sessionByUserIdKey);
// 			await client.del([
// 				userKeyPrefix + userId,
// 				`${emailKeyPrefix}${user.email as string}`,
// 				accountKey as string,
// 				accountByUserKey,
// 				sessionKey as string,
// 				sessionByUserIdKey,
// 			]);
// 		},
// 	};
// }
