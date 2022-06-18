import type { Writable } from "svelte/store";

export function pad(time: number) {
	if (time < 10) return '0' + time;
	return time.toString();
}

export type DonationEvent = {
	username: string;
	quantity: number;
	times: [number, Rarity][];
	realTime: [number, Rarity];
};

export function generateTimes(quantity: number, config: Config) {
	const times: [number, Rarity][] = [];

	for (let i = 0; i < 10; i++) {
		const rand = Math.random();
		if (rand > 1 - (1 / config.legendaryPlus)) times.push([60 * 5 * quantity, Rarity.Legendary]);
		else if (rand > 1 - (1 / config.legendaryPlus) - (1 / config.legendaryMinus)) {
			times.push([-60 * quantity, Rarity.ReallyBad]);
		} else {
			const r = Math.random();
			let rarity = Rarity.Epic;
			if (r < 0.1) rarity = Rarity.Bad;
			else if (r < 0.6) rarity = Rarity.Common;
			else if (r < 0.75) rarity = Rarity.Rare;
			const time = (config.commonLower * quantity) + Math.floor(r * (config.commonUpper - config.commonLower) * quantity);
			times.push([time, rarity])
		}
	}
	return times;
}

export const defaultConfig = {
	legendaryPlus: 100,
	legendaryMinus: 100,
	commonLower: 0,
	commonUpper: 60,
	channel: 'pointcrow',
	streamlabsJWT: '',
};

export type Config = typeof defaultConfig;

export type Overrides = {
	color: Writable<'yellow' | 'red' | 'gray' | undefined>;
	velocity: Writable<number | undefined>
}

export enum Rarity {
	Legendary = 'l',
	Epic = 'e',
	Rare = 'r',
	Common = 'c',
	Bad = 'b',
	ReallyBad = 'rb',
}