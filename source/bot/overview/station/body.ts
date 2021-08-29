import {html as format} from 'telegram-format';

import {EMOJIS} from '../../../html-formatted/emojis.js';
import {formatStation} from '../../../html-formatted/location.js';
import {getPlayerGenerals} from '../../../game/backend.js';
import {infoline, menuPositionPart} from '../../../html-formatted/general.js';
import {isPlayerLocationStation} from '../../../game/typings.js';
import {MyContext} from '../../my-context.js';
import {shipStatsPart} from '../../../html-formatted/ship.js';

export interface Options {
	readonly menuPosition?: readonly string[];
	readonly text?: string;
}

export async function stationBody(ctx: MyContext, options: Options = {}) {
	const {location, ownPlayerId} = ctx.game;
	if (!isPlayerLocationStation(location)) {
		throw new TypeError('not in station');
	}

	const generals = await getPlayerGenerals(ownPlayerId);
	let text = '';

	text += infoline(EMOJIS.station + 'Station', formatStation(location.solarsystem, location.station, true));
	text += '\n';

	text += infoline(EMOJIS.paperclip + 'Paperclips', generals.paperclips.toFixed(0));
	text += '\n';

	if (options.menuPosition?.length) {
		text += menuPositionPart(options.menuPosition);
		text += '\n\n';
	}

	if (options.text) {
		text += options.text;
	} else {
		const assets = await ctx.game.getStationAssets();

		const ships = assets?.ships ?? [];
		if (ships.length > 0) {
			text += format.bold('Ships in Stationhangar');
			text += '\n';
			text += ships.map(ship => shipStatsPart(ctx, ship)).join('\n\n');
			text += '\n\n';
		}

		const storage = Object.entries(assets?.storage ?? {});
		if (storage.length > 0) {
			text += format.bold('Items in Stationhangar');
			text += '\n';
			text += storage.map(([item, amount]) => `${amount}x ${item}`).join('\n');
			text += '\n\n';
		}
	}

	return {text, parse_mode: format.parse_mode};
}
