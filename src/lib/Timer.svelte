<script lang="ts" context="module">
	import { pad, type Overrides } from './util';

	function formatTimeLeft(endTime: number) {
		const timeLeft = endTime - Date.now();
		if (timeLeft < 0) return '00:00:00';

		const hours = Math.trunc(timeLeft / 3600000);
		const minutes = Math.trunc(timeLeft / 60000) % 60;
		const seconds = Math.trunc(timeLeft / 1000) % 60;

		return [pad(hours), pad(minutes), pad(seconds)].join(':');
	}
</script>

<script lang="ts">
	import { browser } from '$app/env';

	import { getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';

	let endTime = getContext<Writable<number>>('endTime');

	let { velocity, color } = getContext<Overrides>('overrides');

	let displayedEndTime = $endTime;

	let timeLeft: string;
	let raf: number;
	const update = () => {
		displayedEndTime = displayedEndTime - (displayedEndTime - $endTime) * 0.05;
		timeLeft = formatTimeLeft(displayedEndTime);
		if (timeLeft === '00:00:00') {
			velocity.set(undefined);
			color.set('gray');
		}
		if (browser) raf = requestAnimationFrame(update);
	};

	update();

	onDestroy(() => {
		if (browser) cancelAnimationFrame(raf);
	});

	const max = 10000;
	$: translation =
		Math.sign(displayedEndTime - $endTime) *
		Math.min(Math.abs(displayedEndTime - $endTime), max) *
		(max / 5000000);

	$: if ($velocity !== undefined) $velocity = translation;
	$: scale = (Math.min(Math.abs(displayedEndTime - $endTime), max) / max) * (max / 100000) + 1;
</script>

<!-- <g class="g"> -->
<text
	style:transform="scale({scale}) translateY({translation}px)"
	class="time"
	fill="#231f20"
	x="50%"
	y="50%"
	dominant-baseline="central"
>
	{timeLeft}
</text>
<!-- </g> -->

<!-- <g class="g" clip-path="url(#dark)">
	<text
		style:transform="scale({scale}) translateY({translation}px)"
		class="time"
		fill="#b3b5b5"
		x="50%"
		y="50%"
		dominant-baseline="central"
	>
		{timeLeft}
	</text>
</g> -->
<style>
	.time {
		transition: transform 0.1s linear;
		transform-origin: center;
		font-size: 64px;
		text-anchor: middle;
		font-weight: 600;
	}
</style>
