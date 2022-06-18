<script lang="ts" context="module">
	import { pad, Rarity } from './util';

	function formatSeconds(seconds: number) {
		const isNegative = seconds < 0 ? '-' : '+';
		seconds = Math.abs(seconds);
		const minutes = Math.floor(seconds / 60);
		seconds %= 60;
		return isNegative + minutes + ':' + pad(seconds);
	}
</script>

<script lang="ts">
	export let translate: number;
	export let time: [number, Rarity];
</script>

<span class={'time ' + time[1]} style:transform="translateY({translate}px)">
	{formatSeconds(time[0])}
</span>

<style>
	.time {
		position: absolute;
		left: 0;
		top: 0;
		height: 38px;
		line-height: 38px;
		font-size: 30px;
	}
	.rb {
		color: #fc0f0f;
		text-shadow: 0 0 2px #ff3f3f, 0 0 10px #fe776b, 0 0 20px black;

		font-weight: 500;
	}
	.l {
		color: #fcec0f;
		text-shadow: 0 0 2px #fcec0f, 0 0 10px #fff456, 0 0 20px white;

		font-weight: 500;
	}
	.e {
		color: #ba19ff;
		text-shadow: 0 0 2px #ba19ff, 0 0 10px #d77aff;
		font-weight: 500;
	}
	.r {
		text-shadow: 0 0 1px #3848ff, 0 0 5px #a8afff;
		color: #3848ff;
	}
	.c {
		color: #19ff4b;
	}
	.b {
		color: #c6c6c6;
	}
</style>
