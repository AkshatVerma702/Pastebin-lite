import { NextResponse } from "next/server";
import { createPaste } from "@/app/lib/pasteStore";
import crypto from "crypto";

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const { content, ttl_seconds, max_views } = body;

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
      { error: "ttl_seconds must be an integer >= 1" },
      { status: 400 }
    );
  }

  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return NextResponse.json(
      { error: "max_views must be an integer >= 1" },
      { status: 400 }
    );
  }

  const id = crypto.randomBytes(4).toString("hex");

  createPaste({
    id,
    content,
    createdAt: Date.now(),
    ttlSeconds: ttl_seconds ?? null,
    maxViews: max_views ?? null,
    views: 0,
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "";

  return NextResponse.json(
    {
      id,
      url: `${baseUrl}/p/${id}`,
    },
    { status: 201 }
  );
}