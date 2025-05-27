import { Adapter } from "next-auth/adapters";
import BaseContext from "../container/BaseContext";


class AuthService extends BaseContext{

  public getAdapter():Adapter{
    const redis = this.di.redis;
    return {
      createSession: async (session) => {
        const res = await redis.set(session.sessionToken, JSON.stringify(session));
        return session;
      }
    }
  }
}