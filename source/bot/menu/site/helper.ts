import {getPlayerLocation} from '../../../game/get-whatever.js';
import {MyContext} from '../../my-context.js';

export async function getPlayerInSite(_ctx: MyContext) {
	const location = await getPlayerLocation();
	if (!('site' in location)) {
		throw new Error('player has to be in site');
	}

	return location;
}

export async function getPlayerInSpace(_ctx: MyContext) {
	const location = await getPlayerLocation();
	if (!('shipStatus' in location)) {
		throw new Error('player has to be in space');
	}

	return location;
}
