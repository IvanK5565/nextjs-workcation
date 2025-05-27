import { createClient, RedisClientType } from "redis";
import IContextContainer from "@/server/container/IContextContainer";

function getRedisConnection(ctx:IContextContainer){
  const redis:RedisClientType = createClient();
  redis.connect();
  return redis;
}

export default getRedisConnection;