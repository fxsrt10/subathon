<script lang="ts">
	import type { DonationEvent } from './util';
	import { browser } from '$app/env';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import SpinnerTime from './SpinnerTime.svelte';

	const dispatch = createEventDispatcher<{ done: never }>();

	export let event: DonationEvent | undefined;

	let offset = 0;
	let velocity = 10;
	$: if (event) {
		offset = 0;
		velocity = 10;
	}
	let raf: number;
	const update = () => {
		if (event) {
			offset -= velocity;
			velocity *= 0.98146;
			offset += event.times.length * 38;
			offset %= event.times.length * 38;
			if (Math.abs(velocity) < 0.1 && velocity !== 0) {
				velocity = 0;
				dispatch('done');
			}
		}
		if (browser) raf = requestAnimationFrame(update);
	};

	update();

	onDestroy(() => {
		if (browser) cancelAnimationFrame(raf);
	});
</script>

{#if event}
	<div class="root">
		{#each event.times as time, i}
			<SpinnerTime translate={-offset + 38 * i} {time} />
		{/each}
		<SpinnerTime translate={-offset + 38 * event.times.length} time={event.times[0]} />
	</div>
{/if}

<style>
	.root {
		position: relative;
		display: inline-block;
		overflow: hidden;
		width: 120px;
	}
</style>
