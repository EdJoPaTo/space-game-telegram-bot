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

	text += infoline('Money', generals.paperclips.toFixed(0) + EMOJIS.paperclip);
	text += '\n';

	if (options.menuPosition?.length) {
		text += menuPositionPart(options.menuPosition);
		text += '\n\n';
	}

	if (options.text) {
		text += options.text;
	} else {
		text += format.italic('Current Ship');
		text += ': '
		text += shipStatsPart(ctx, await ctx.game.getShip());
		text += '\n\n'

		const assets = await ctx.game.getStationAssets();

		text += infoline('Other Ships in Stationhangar', assets.ships?.length ?? 0)
		text += '\n'

		const storage = Object.entries(assets.storage ?? {});
		if (storage.length > 0) {
			text += format.bold('Items in Stationhangar');
			text += '\n';
			text += storage.map(([item, amount]) => `${amount}x ${item}`).join('\n');
			text += '\n\n';
		}
	}

	return {text, parse_mode: format.parse_mode};
}
