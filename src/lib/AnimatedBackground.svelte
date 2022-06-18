<script lang="ts" context="module">
	type Triangle = {
		x: number;
		y: number;
		yv: number;
		av: number;
		size: number;
		rot: number;
	};
	function drawTriangle({ x, y, size, rot }: Triangle) {
		const points = [
			[Math.cos(rot) * size + x, Math.sin(rot) * size + y],
			[Math.cos(rot + (2 * Math.PI) / 3) * size + x, Math.sin(rot + (2 * Math.PI) / 3) * size + y],
			[Math.cos(rot + (4 * Math.PI) / 3) * size + x, Math.sin(rot + (4 * Math.PI) / 3) * size + y],
		];
		return {
			points: points.map((p) => `${p[0]},${p[1]}`).join(' '),
		};
	}
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	import type { Overrides } from './util';

	export let width: number;
	export let height: number;
	export let quantity: number;

	let { velocity } = getContext<Overrides>('overrides');

	function randomTriangle(): Triangle {
		return {
			x: Math.random() * width,
			y: Math.random() * height,
			yv: Math.random() + 0.5,
			av: Math.random() * 0.1 - 0.05,
			size: Math.random() * 30 + 10,
			rot: (Math.random() * Math.PI) / 2,
		};
	}

	const triangles: Triangle[] = new Array(quantity).fill(0).map(randomTriangle);

	setInterval(() => {
		for (let i = 0; i < triangles.length; i++) {
			if ($velocity !== undefined) {
				triangles[i].rot += triangles[i].av;
			}
			if ($velocity === undefined || Math.abs($velocity) > Math.abs(triangles[i].yv)) {
				triangles[i].y += $velocity ?? 0;
			} else {
				triangles[i].y += triangles[i].yv;
			}
			if (triangles[i].y > height + triangles[i].size) {
				triangles[i] = randomTriangle();
				triangles[i].y = -triangles[i].size;
			}
			if (triangles[i].y < -triangles[i].size) {
				triangles[i] = randomTriangle();
				triangles[i].y = height + triangles[i].size;
			}
		}
	}, 50);
</script>

{#each triangles as triangle}
	<polygon {...drawTriangle(triangle)} />
{/each}
