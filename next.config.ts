import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Mirrors the production app's distDir switch.
	distDir: process.env.SHTORA_E2E === "1" ? ".next-e2e" : ".next",

	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "Strict-Transport-Security",
						value: "max-age=31536000; includeSubDomains; preload",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
				],
			},
		];
	},
};

export default nextConfig;

// Mirrors the production app: OpenNext dev init runs at build time and seeds
// wrangler.jsonc vars into process.env ("Using secrets defined in .dev.vars").
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
