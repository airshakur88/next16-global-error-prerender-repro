import type { ReactNode } from "react";
import { connection } from "next/server";

// Mirrors the production app: protected routes live in a route group with a
// dynamic (per-request) layout.
export default async function ProtectedLayout({
	children,
}: {
	children: ReactNode;
}) {
	await connection();
	return <>{children}</>;
}
