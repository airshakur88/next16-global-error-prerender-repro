"use client";

// Mirrors the production app's root-layout client provider nesting:
// TooltipProvider > AuthProvider > VaultProvider > children, plus a Toaster.
// Each provider is a real React context with consumers in the tree.

import {
	createContext,
	useContext,
	useState,
	type ReactNode,
} from "react";
import { motion } from "motion/react";

const TooltipContext = createContext<boolean>(false);
const AuthContext = createContext<{ user: string | null }>({ user: null });
const VaultContext = createContext<{ status: string }>({ status: "locked" });

export function TooltipProvider({ children }: { children: ReactNode }) {
	return (
		<TooltipContext.Provider value={true}>{children}</TooltipContext.Provider>
	);
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user] = useState<string | null>(null);
	return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export function VaultProvider({ children }: { children: ReactNode }) {
	const [status] = useState("locked");
	return <VaultContext.Provider value={{ status }}>{children}</VaultContext.Provider>;
}

export function Toaster() {
	const enabled = useContext(TooltipContext);
	return (
		<motion.div
			aria-hidden
			initial={{ opacity: 0 }}
			animate={{ opacity: enabled ? 1 : 0 }}
		>
			Toaster
		</motion.div>
	);
}
