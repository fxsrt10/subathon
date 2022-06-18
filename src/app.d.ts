/// <reference types="@sveltejs/kit" />
/// <reference types="@cloudflare/workers-types" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
declare namespace App {
	// interface Locals {}
	interface Platform {
		env: {
			SUBATHONS: KVNamespace;
		};
	}
	// interface Session {}
	interface Stuff {
		auth?: string;
	}
}
