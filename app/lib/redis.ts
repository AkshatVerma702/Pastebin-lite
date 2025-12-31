import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;

export default async function getRedis() {
  if (client && client.isOpen) return client;

  client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on("error", (err) => {
    console.error("Redis Client Error", err);
  });

  await client.connect();
  console.log("redis working")
  return client;
}
