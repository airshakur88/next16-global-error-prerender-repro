"use client";

import { useState } from "react";

// Mirrors the production app: client page component behind auth.
export function AccountPage() {
	const [pending, setPending] = useState(false);
	return (
		<section>
			<h1>Account</h1>
			<button type="button" onClick={() => setPending(!pending)}>
				Sign out
			</button>
		</section>
	);
}
