import { browser } from "$app/env";
// import {TypedEmitter} from "tiny-typed-emitter";
import type { Client, SubMethods } from "tmi.js";
import { generateTimes, type Config, type DonationEvent } from "./util";
import TypedEmitter from 'eventemitter3';

interface TwitchEvents {
	event: (e: DonationEvent) => void;
}

function getSubMultiplier(methods?: SubMethods) {
	switch (methods?.plan) {
		case '2000':
			return 2;
		case '3000':
			return 6;
		default:
			return 1;
	}
}
export class TwitchWrapper extends TypedEmitter<TwitchEvents> {
	private client: Client;
	private connected = false;
	private oldChannel?: string;
	private giftCounts = new Map<string | undefined, number>();

	public config: Config;

	constructor() {
		super();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (browser) this.client = new (window as any).tmi.Client();

		this.client?.on('subscription', (_0, username, sub, _3, user) => {
			this.triggerEvent(user["display-name"] ?? username, getSubMultiplier(sub));
		})
		this.client?.on('resub', (_0, username, _2, _3, user, sub) => {
			this.triggerEvent(user["display-name"] ?? username, getSubMultiplier(sub));
		})
		this.client?.on('cheer', (_0, user) => {
			const quantity = Math.floor(Number(user.bits ?? '0') / 500);
			if (quantity === 0) return;
			this.triggerEvent(user["display-name"] ?? user.username ?? 'Anonymous', quantity);
		})
		this.client?.on('subgift', (_0, username, _2, _3, sub, user) => {
			const previousGiftCount = this.giftCounts.get(username) ?? 0;
			if (previousGiftCount > 0) {
				this.giftCounts.set(username, previousGiftCount - 1);
			} else {
				this.triggerEvent(user["display-name"] ?? username, getSubMultiplier(sub));
			}
		})
		this.client?.on('anonsubgift', (_0, _1, _2, sub) => {
			const previousGiftCount = this.giftCounts.get(undefined) ?? 0;
			if (previousGiftCount > 0) {
				this.giftCounts.set(undefined, previousGiftCount - 1);
			} else {
				this.triggerEvent('Anonymous', getSubMultiplier(sub));
			}
		})
		this.client?.on('submysterygift', (_0, username, count, sub, user) => {
			const previousGiftCount = this.giftCounts.get(username) ?? 0;
			this.giftCounts.set(username, previousGiftCount + count);

			this.triggerEvent(user["display-name"] ?? username, count * getSubMultiplier(sub));
		})
		this.client?.on('anonsubmysterygift', (_0, count, sub) => {
			const previousGiftCount = this.giftCounts.get(undefined) ?? 0;
			this.giftCounts.set(undefined, previousGiftCount + count);

			this.triggerEvent('Anonymous', count * getSubMultiplier(sub));
		})
	}
	triggerEvent(username: string, quantity: number) {
		const times = generateTimes(quantity, this.config);
		this.emit('event', {
			username,
			quantity,
			times,
			realTime: times[6],
		});
	}

	async setChannel(channel: string) {
		if (!browser) return;
		if (this.oldChannel === channel) return;
		if (!this.connected) {
			await this.client.connect();
			this.connected = true;
		}
		if (this.oldChannel) this.client.part(this.oldChannel);
		this.client.join(channel);
		this.oldChannel = channel;
	}

	disconnect() {
		this.client?.disconnect();
	}
}