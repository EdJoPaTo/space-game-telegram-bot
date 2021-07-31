import {getOwnLocation} from '../general.js';
import {MyContext} from '../../my-context.js';

export async function getPlayerInSite(ctx: MyContext) {
	const location = await getOwnLocation(ctx);
	if (!('site' in location)) {
		throw new Error('player has to be in site');
	}

	return location;
}

export async function getPlayerInSpace(ctx: MyContext) {
	const location = await getOwnLocation(ctx);
	if (!('shipStatus' in location)) {
		throw new Error('player has to be in space');
	}

	return location;
}
