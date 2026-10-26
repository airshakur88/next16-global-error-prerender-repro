import type { ReactNode } from "react";

// Mirrors the production app: auth routes live in a route group.
export default function AuthLayout({ children }: { children: ReactNode }) {
	return <div className="auth-layout">{children}</div>;
}
