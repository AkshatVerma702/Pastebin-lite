import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import getRedis from "@/app/lib/redis";

export async function POST(req: NextRequest) {
  let body: any;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { content, ttl_seconds, max_views } = body;

  // Validation
  if (typeof content !== "string" || content.trim() === "") {
    return NextResponse.json(
      { error: "content must be a non-empty string" },
      { status: 400 }
    );
  }

  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return NextResponse.json(
      { error: "ttl_seconds must be an integer ≥ 1" },
      { status: 400 }
    );
  }

  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return NextResponse.json(
      { error: "max_views must be an integer ≥ 1" },
      { status: 400 }
    );
  }

  const id = crypto.randomBytes(4).toString("hex");

  const now = Date.now();
  const expires_at =
    ttl_seconds !== undefined ? now + ttl_seconds * 1000 : null;

  const paste = {
    content,
    expires_at,
    remaining_views: max_views ?? null,
  };

  const redis = await getRedis();
  const key = `paste:${id}`;

  await redis.set(key, JSON.stringify(paste));

  // Set Redis TTL only if ttl_seconds exists
  if (ttl_seconds !== undefined) {
    await redis.expire(key, ttl_seconds);
  }

  const host = req.headers.get("host");
  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  return NextResponse.json(
    {
      id,
      url: `${protocol}://${host}/p/${id}`,
    },
    { status: 201 }
  );
}
