import { NextResponse } from "next/server";
import getRedis from "@/app/lib/redis";

export async function GET() {
  const redis = await getRedis();
  await redis.set("ping", "pong");
  const value = await redis.get("ping");

  return NextResponse.json({ value });
}
