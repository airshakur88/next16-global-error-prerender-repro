"use client";

import { useState } from "react";

// Mirrors the production app: client-heavy auth page components.
export function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	return (
		<form className="auth-form">
			<label htmlFor="identifier">Email or username</label>
			<input
				id="identifier"
				value={email}
				onChange={(event) => setEmail(event.target.value)}
			/>
			<label htmlFor="password">Account password</label>
			<input
				id="password"
				type="password"
				value={password}
				onChange={(event) => setPassword(event.target.value)}
			/>
			<button type="submit">Sign in</button>
		</form>
	);
}
