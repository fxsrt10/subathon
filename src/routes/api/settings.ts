import { type Config, defaultConfig } from "$lib/util";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async ({ platform, request }) => {
	if (request.headers.get('Authorization') !== import.meta.env.VITE_AUTH_KEY) return {
		status: 401
	};
	const body = await platform?.env.SUBATHONS.get<Config>('pointcrow', 'json');
	return {
		body: body ?? defaultConfig
	}
};


export const post: RequestHandler = async ({platform, request}) => {
	if (request.headers.get('Authorization') !== import.meta.env.VITE_AUTH_KEY) return {
		status: 401
	};
	await platform.env.SUBATHONS.put('pointcrow', await request.text());
	return {
		status: 201
	};
};
