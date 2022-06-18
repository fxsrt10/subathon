<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ url }) => {
		const auth = url.searchParams.get('auth');
		return {
			stuff: {
				auth,
			},
		};
	};
</script>

<script>
	import '@fontsource/rubik/400.css';
	import '@fontsource/rubik/500.css';
	import '@fontsource/rubik/600.css';
	import '$lib/app.css';
</script>

<slot />
