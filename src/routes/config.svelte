<script lang="ts">
	import { page } from '$app/stores';

	import { defaultConfig } from '$lib/util';
	import { onMount } from 'svelte';

	export let config = defaultConfig;
	onMount(() => {
		fetch(`/api/settings?t=${Date.now()}`, {
			headers: {
				Authorization: $page.stuff.auth,
			},
		}).then(async (r) => {
			config = await r.json();
		});
	});
	async function save() {
		await fetch('/api/settings', {
			method: 'POST',
			headers: {
				Authorization: $page.stuff.auth,
			},
			body: JSON.stringify(config),
		});
	}
</script>

<h1>Subathon Config</h1>
<h2>Gacha Parameters</h2>
<label>
	<span class="label">Chance of Legendary +5:00 (1/{config.legendaryPlus})</span>
	<input type="number" bind:value={config.legendaryPlus} />
</label>
<label>
	<span class="label">Chance of Legendary -1:00 (1/{config.legendaryMinus})</span>
	<input type="number" bind:value={config.legendaryMinus} />
</label>
<label>
	<span class="label">Common Lower Bound (seconds)</span>
	<input type="number" bind:value={config.commonLower} />
</label>
<label>
	<span class="label">Common Upper Bound (seconds)</span>
	<input type="number" bind:value={config.commonUpper} />
</label>

<h2>Settings</h2>

<label>
	<span class="label">Twitch Channel</span>
	<input type="text" bind:value={config.channel} />
</label>
<label>
	<span class="label">Streamlabs JWT</span>
	<input type="password" bind:value={config.streamlabsJWT} />
</label>

<button on:click={() => save()}>Save Changes</button>

<style>
	h1 {
		text-align: center;
	}
	label {
		display: block;
		margin: 8px;
	}
	.label {
		width: 400px;
		display: block;
	}
	input {
		margin: 8px;
		padding: 8px;
		border-radius: 8px;
		border: 1px solid black;
		width: 300px;
	}
	button {
		margin: 8px;
		padding: 8px;
		border-radius: 8px;
		border: 1px solid black;
		cursor: pointer;
		transition: background 0.1s linear;
	}
	button:hover {
		background: #ddd;
	}
	button:active {
		background: #999;
	}
</style>
