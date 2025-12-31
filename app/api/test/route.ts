import { NextResponse } from "next/server";

export function GET() {
    return NextResponse.json("Working", {
        status: 200
    })
}