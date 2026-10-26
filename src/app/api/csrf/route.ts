import { NextResponse } from "next/server";

// Mirrors the production app's route-handler surface (existence only).
export async function GET() {
	return NextResponse.json({ ok: true });
}
