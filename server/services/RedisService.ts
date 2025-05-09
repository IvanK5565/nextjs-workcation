import { createClient, RedisClientType } from "redis";
import BaseContext from "@/server/context/BaseContext";
import IContextContainer from "@/server/context/IContextContainer";

export class RedisService extends BaseContext {
  private client: RedisClientType;

  constructor(opts: IContextContainer) {
    super(opts);
    this.client = createClient({ url: process.env.REDIS_URL });
    this.client.on("error", (err) => opts.Logger.error("Redis Client Error", err));
    try {
      this.client.connect();
    } catch (e) {
      opts.Logger.error("Failed to connect to Redis:", e);
    }
  }

  async setKey(
    key: string,
    value: string,
    ttlInSeconds?: number
  ): Promise<void> {
    if (ttlInSeconds) {
      await this.client.set(key, value, {
        EX: ttlInSeconds,
      });
    } else {
      await this.client.set(key, value);
    }
  }

  async getKey(key: string): Promise<string | null> {
    const value = await this.client.get(key);
    return value;
  }

  async deleteKey(key: string): Promise<void> {
    await this.client.del(key);
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}
