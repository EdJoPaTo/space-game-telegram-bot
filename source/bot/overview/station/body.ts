import {html as format} from 'telegram-format';

import {EMOJIS} from '../../../html-formatted/emojis.js';
import {formatStation} from '../../../html-formatted/location.js';
import {getPlayerGenerals} from '../../../game/backend.js';
import {infoline, menuPositionPart} from '../../../html-formatted/general.js';
import {isPlayerLocationStation} from '../../../game/typings.js';
import {MyContext} from '../../my-context.js';

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

	if (options.menuPosition?.length) {
		text += menuPositionPart(options.menuPosition);
		text += '\n\n';
	}

	if (options.text) {
		text += options.text;
	}

	return {text, parse_mode: format.parse_mode};
}
