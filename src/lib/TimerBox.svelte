<script lang="ts">
	import Timer from '$lib/Timer.svelte';
	import { getContext } from 'svelte';
	import AnimatedBackground from './AnimatedBackground.svelte';
	import type { Overrides } from './util';

	const { color } = getContext<Overrides>('overrides');

	$: actualColors =
		$color === 'yellow'
			? ['#fffeb8', '#fff877', '#ffe23a']
			: $color === 'red'
			? ['#ffbaba', '#ff9c9c', '#ff5d5d']
			: $color === 'gray'
			? ['#999', '#888', '#777']
			: ['#fff', '#d5d5d5', '#959595'];

	const width = 325;
	const height = 110;
</script>

<div class="box" style:width="{width}px" style:height="{height}px">
	<svg {width} {height} style:background={actualColors[0]}>
		<defs>
			<clipPath id="dark">
				<AnimatedBackground {width} {height} quantity={3} />
			</clipPath>
			<clipPath id="light">
				<AnimatedBackground {width} {height} quantity={8} />
			</clipPath>
		</defs>
		<rect clip-path="url(#light)" x={0} y={0} {width} {height} fill={actualColors[1]} />
		<rect clip-path="url(#dark)" x={0} y={0} {width} {height} fill={actualColors[2]} />
		<Timer />
	</svg>
</div>

<style>
	svg {
		transition: background 0.2s ease;
		position: absolute;
		z-index: -1;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
	.box {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;

		color: white;
		border-radius: 16px;
		overflow: hidden;
	}
	rect {
		transition: fill 0.2s ease;
	}
</style>
