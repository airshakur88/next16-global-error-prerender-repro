import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
	const nonce = btoa(
		String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))),
	);
	const development = process.env.NODE_ENV === "development";
	const policy = [
		"default-src 'self'",
		`script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'wasm-unsafe-eval'${development ? " 'unsafe-eval'" : ""}`,
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: blob:",
		"font-src 'self' data:",
		"connect-src 'self' https://*.cloudflarestorage.com",
		"object-src 'none'",
		"frame-ancestors 'none'",
		"base-uri 'none'",
		"form-action 'self'",
	].join("; ");
	const headers = new Headers(request.headers);
	headers.set("x-nonce", nonce);
	headers.set("Content-Security-Policy", policy);
	const response = NextResponse.next({ request: { headers } });
	response.headers.set("Content-Security-Policy", policy);
	response.headers.set("Cache-Control", "private, no-store");
	return response;
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
