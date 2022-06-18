<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Spinner from './Spinner.svelte';
	import type { DonationEvent } from './util';

	const dispatch = createEventDispatcher<{ done: never }>();

	export let event: DonationEvent | undefined;

	let open = false;

	let username = '';
	$: if (event) {
		username = event.username;
		setTimeout(() => {
			open = true;
		}, 1);
	} else {
		open = false;
	}
</script>

<div class="container" style:transform="translate(-50%, {open ? -38 : 0}px) scale({open ? 1 : 0})">
	<span class="name">{username}</span>
	{#key open}
		<Spinner {event} on:done={() => dispatch('done')} />
	{/key}
</div>

<style>
	.container {
		position: absolute;
		left: 50%;
		z-index: -1;
		transition: transform 1s ease;
		width: 325px;
		text-align: center;
		color: white;
		display: flex;
		justify-content: center;
		align-items: stretch;
		gap: 16px;
	}
	.name {
		font-size: 32px;
		font-weight: 500;
		white-space: nowrap;
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
