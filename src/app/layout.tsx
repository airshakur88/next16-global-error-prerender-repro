import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { connection } from "next/server";
import "./globals.css";
import {
	AuthProvider,
	TooltipProvider,
	Toaster,
	VaultProvider,
} from "./Providers";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Repro App",
	description: "Minimal reproduction of the /_global-error prerender crash.",
};

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
	colorScheme: "dark",
	themeColor: "#0b0c0e",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Mirrors the production app: per-request dynamic HTML.
	await connection();
	return (
		<html className={`dark ${inter.variable} font-sans`}>
			<body className="antialiased">
				{/* Mirrors the production provider nesting: TooltipProvider > AuthProvider > VaultProvider > children + Toaster */}
				<TooltipProvider>
					<AuthProvider>
						<VaultProvider>
							{children}
							<Toaster />
						</VaultProvider>
					</AuthProvider>
				</TooltipProvider>
			</body>
		</html>
	);
}
