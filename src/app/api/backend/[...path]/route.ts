import { NextResponse } from "next/server";

// Mirrors the production app's catch-all backend proxy route (existence only).
export async function GET() {
	return NextResponse.json({ ok: true });
}

export async function POST() {
	return NextResponse.json({ ok: true });
}
