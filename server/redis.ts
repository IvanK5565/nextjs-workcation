import { createClient, RedisClientType } from "redis";
import IContextContainer from "@/server/container/IContextContainer";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getRedisConnection(ctx:IContextContainer){
  const redis:RedisClientType = createClient();
  redis.connect();
  return redis;
}

export default getRedisConnection;