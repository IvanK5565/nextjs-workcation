/* eslint-disable @typescript-eslint/no-explicit-any */
import Guard from "@/acl/Guard";
import { Adapter, AdapterUser } from "next-auth/adapters";
import { v4 as uuidv4 } from "uuid";
import IContextContainer from "./interfaces/IContextContainer";

export const createRedisAdapter = (di: IContextContainer): Adapter => {
  const redis = di.redis;

  return {
    async createSession(session: any) {
      const sessionId = session.sessionToken || uuidv4();
      if (!session?.auth?.identity?.id && session?.userId) {
        const guard = new Guard(di.roles, di.rules);
        const res = await di.Identity.preparedUser(session?.userId);
        const preparedUser = di.Identity.cleanGuardIdentity(
          guard,
          res.identity
        );
        session = JSON.parse(
          JSON.stringify({
            user: {
              id: res?.identity?.id,
              email: res?.identity?.email,
              name: `${preparedUser?.identity?.firstName} ${preparedUser?.identity?.lastName}`,
              image: preparedUser?.identity?.avatarImage,
            } as AdapterUser,
            auth: preparedUser,
            sessionToken: sessionId,
            expires: session.expires,
          })
        );
      }
      if (typeof session.expires === "string") {
        session.expires = new Date(session.expires);
      }
      const key = `session:${sessionId}`;
      if (session?.auth?.identity?.id && key) {
        await di.UsersService.saveUserSessionKey(
          session.auth.identity.id,
          key
        );
      }
      const ttl = Math.floor((session.expires.getTime() - Date.now()) / 1000);

      await redis.setKey(key, JSON.stringify(session), ttl);
      return { ...session, sessionToken: sessionId };
    },

    async updateSession({ sessionToken, expires }) {
      const sessionId = sessionToken;
      const key = `session:${sessionId}`;

      if (!sessionId) return null;

      const raw = await redis.getKey(key);
      if (!raw) return null;

      const existingSession = JSON.parse(raw);

      if (typeof expires === "string") {
        expires = new Date(expires);
      }

      existingSession.expires = expires;

      const ttl = Math.floor((expires.getTime() - Date.now()) / 1000);
      await redis.setKey(key, JSON.stringify(existingSession), ttl);

      return existingSession;
    },

    async getSessionAndUser(sessionToken) {
      const key = `session:${sessionToken}`;
      const raw = await redis.getKey(key);
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (typeof session.expires === "string") {
        session.expires = new Date(session.expires);
      }
      return {
        session,
        user: { ...session.user, auth: session.auth },
      };
    },

    async getUserByEmail(email) {
      const user = await di.UsersService.findUserWithEmail(email);
      if (!user) {
        return null;
      }
      const preparedUser = {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        image: user.avatarImage,
        ...user?.dataValues,
      } as any;
      return preparedUser;
    },

    async linkAccount(account) {
      await di.UsersService.linkUserAccountByEmail(
        account?.resolvedUser?.email,
        account?.providerAccountId,
        account?.provider,
        account?.profile
      );
      return account;
    },

    async getUserByAccount({ providerAccountId }) {
      const user = await di.UsersService.findUserWithAccountId(
        providerAccountId
      );
      if (!user) {
        return null;
      }
      const preparedUser = {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        image: user.avatarImage,
        ...user?.dataValues,
      } as any;
      return preparedUser;
    },

    async deleteSession(sessionToken) {
      const key = `session:${sessionToken}`;
      await redis.deleteKey(key);
    },
  };
};
