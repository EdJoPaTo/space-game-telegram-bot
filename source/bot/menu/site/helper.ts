import {getOwnLocation} from '../general.js';
import {isLocationSite} from '../../../game/typing-checks.js';
import {MyContext} from '../../my-context.js';

export async function getPlayerInSite(ctx: MyContext) {
	const location = await getOwnLocation(ctx);
	if (!isLocationSite(location)) {
		throw new Error('player has to be in site');
	}

	return location;
}
