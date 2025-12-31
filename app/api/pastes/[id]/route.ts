import { NextRequest, NextResponse } from "next/server";
import getRedis from "@/app/lib/redis";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }>}) {
    const redis = await getRedis();
    const {id} = await params
    const key = `paste:${id}`;

    const raw = await redis.get(key);
    if (!raw) return NextResponse.json({ error: "Paste not found" }, { status: 404 });

    const paste = JSON.parse(raw);

    // Check if x-test-now-ms is provided, else use real time
    const testNowHeader = req.headers.get("x-test-now-ms");
    const now = testNowHeader ? parseInt(testNowHeader, 10) : Date.now();

    // Check TTL
    if (paste.expires_at && now > paste.expires_at) {
        await redis.del(key);
        return NextResponse.json({ error: "Paste expired" }, { status: 404 });
    }

    // Check view limit
    if (paste.remaining_views !== null) {
        if (paste.remaining_views <= 0) {
            await redis.del(key);
            return NextResponse.json({ error: "Paste view limit exceeded" }, { status: 404 });
        }
        paste.remaining_views -= 1;
        await redis.set(key, JSON.stringify(paste));
    }

    return NextResponse.json({
        content: paste.content,
        remaining_views: paste.remaining_views,
        expires_at: paste.expires_at
    });
}
