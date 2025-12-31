import { NextResponse } from "next/server";
import { getPaste, deletePaste } from "@/app/lib/pasteStore";

function getNow(req: Request) {
  if (process.env.TEST_MODE === "1") {
    const header = req.headers.get("x-test-now-ms");
    if (header) return Number(header);
  }
  return Date.now();
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const paste = getPaste(params.id);

  if (!paste) {
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  const now = getNow(req);

  // TTL check
  if (
    paste.ttlSeconds !== null &&
    now > paste.createdAt + paste.ttlSeconds * 1000
  ) {
    deletePaste(paste.id);
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  // View limit check
  if (
    paste.maxViews !== null &&
    paste.views >= paste.maxViews
  ) {
    deletePaste(paste.id);
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  // Increment views
  paste.views += 1;

  return NextResponse.json(
    {
      content: paste.content,
      remaining_views:
        paste.maxViews === null
          ? null
          : Math.max(paste.maxViews - paste.views, 0),
      expires_at:
        paste.ttlSeconds === null
          ? null
          : new Date(
              paste.createdAt + paste.ttlSeconds * 1000
            ).toISOString(),
    },
    { status: 200 }
  );
}