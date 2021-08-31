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

	if (options.menuPosition?.length) {
		text += menuPositionPart(options.menuPosition);
		text += '\n\n';
	}

	if (options.text) {
		text += options.text;
	} else {
		text += infoline('Money', generals.paperclips.toFixed(0) + EMOJIS.paperclip);
		text += '\n';

		text += format.italic('Current Ship');
		text += ': ';
		text += shipStatsPart(ctx, await ctx.game.getShip());
		text += '\n\n';

		const assets = await ctx.game.getStationAssets();

		text += format.bold('Stationhangar');
		text += '\n';
		text += infoline('Stored Ships', assets.ships?.length ?? 0);
		const totalItems = Object.values(assets.storage ?? {}).reduce((a, b) => a + b);
		text += infoline('Items', totalItems);
	}

	return {text, parse_mode: format.parse_mode};
}
