<script lang="ts">
	import TimerBox from '$lib/TimerBox.svelte';
	import { onDestroy, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import DonorName from '$lib/DonorName.svelte';
	import { defaultConfig, generateTimes, Rarity, type Config, type DonationEvent } from '$lib/util';
	import type { Socket } from 'socket.io-client';
	import { TwitchWrapper } from '$lib/twitch';
	import { browser } from '$app/env';
	import { page } from '$app/stores';

	let initialEndTime = new Date(2022, 7, 29, 15, 0, 0).getTime();

	if (browser && localStorage.getItem('endTime')) {
		const time = Number(localStorage.getItem('endTime'));
		if (!isNaN(time)) initialEndTime = time;
	}
	const endTime = writable(initialEndTime);
	endTime.subscribe((v) => {
		if (!browser) return;
		localStorage.setItem('endTime', v.toString());
	});
	setContext('endTime', endTime);

	const overrideVelocity = writable(0);
	const overrideColor = writable(undefined);
	setContext('overrides', {
		velocity: overrideVelocity,
		color: overrideColor,
	});

	const config = writable(defaultConfig);
	setContext('config', config);
	const interval = setInterval(async () => {
		const res = await fetch(`/api/settings?t=${Date.now()}`, {
			headers: {
				Authorization: $page.stuff.auth,
			},
		}).then((r) => r.json() as Promise<Config>);
		config.set(res);
	}, 5000);
	onDestroy(() => {
		clearInterval(interval);
		streamlabs?.disconnect();
		twitch?.disconnect();
	});

	$: jwt = $config.streamlabsJWT;
	let streamlabs: typeof Socket;
	$: {
		if (jwt) {
			streamlabs?.close();
			streamlabs = io(`https://sockets.streamlabs.com?token=${jwt}`, {
				transports: ['websocket'],
			});
			streamlabs.on('event', handleDonation);
		}
	}

	const handleDonation = (ev) => {
		if (!ev.for && ev.type === 'donation' && ev.message?.[0]) {
			const quantity = Math.floor(Number(ev.message[0].amount) / 5);
			if (isNaN(quantity)) return;
			const times = generateTimes(quantity, $config);

			updateQueue({
				username: ev.message[0].from,
				quantity,
				times,
				realTime: times[6],
			});
		}
	};

	$: channel = $config.channel;

	let twitch = new TwitchWrapper();
	$: twitch.setChannel(channel);
	$: twitch.config = $config;

	twitch.on('event', (ev) => {
		updateQueue(ev);
	});

	let currentEvent: DonationEvent | undefined;
	const queue: DonationEvent[] = [];
	function updateQueue(ev?: DonationEvent) {
		if ($endTime - Date.now() < 0) return;
		if (ev) queue.push(ev);

		// Done on empty queue
		if (!queue.length) return;

		// No overlap
		if (currentEvent) return;
		const nextEvent = queue.shift();
		currentEvent = nextEvent;
	}

	function handleKey(ev: KeyboardEvent) {
		switch (ev.key) {
			case 'ArrowUp':
				endTime.update((t) => t + 60 * 60 * 1000);
				// endTime.update((t) => t + 60000);
				break;
			case 'ArrowRight':
				endTime.update((t) => t + 15 * 60 * 1000);
				// endTime.update((t) => t + 60000);
				break;
			case 'ArrowLeft':
				endTime.update((t) => t - 15 * 60 * 1000);
				break;
			case 'ArrowDown':
				endTime.update((t) => t - 60 * 60 * 1000);
				break;
		}
	}
</script>

<svelte:window on:keydown={handleKey} />

<div class="container">
	<DonorName
		event={currentEvent}
		on:done={() => {
			endTime.update((t) => t + currentEvent.realTime[0] * 1000);
			const rarity = currentEvent.realTime[1];
			let timeout = 500;
			if (rarity === Rarity.Legendary) {
				timeout = 2000;
				$overrideColor = 'yellow';
			} else if (rarity === Rarity.ReallyBad) {
				timeout = 2000;
				$overrideColor = 'red';
			}
			currentEvent = undefined;
			setTimeout(() => {
				$overrideColor = undefined;
				updateQueue();
			}, timeout);
		}}
	/>
	<TimerBox />
</div>

<style>
	.container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
