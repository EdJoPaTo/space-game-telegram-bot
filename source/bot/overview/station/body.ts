import {html as format} from 'telegram-format';

import {EMOJIS, getRomanNumber} from '../../../html-formatted/emojis.js';
import {getPlayerGenerals} from '../../../game/backend.js';
import {infoline} from '../../../html-formatted/general.js';
import {isLocationStation} from '../../../game/typing-checks.js';
import {MyContext} from '../../my-context.js';

export interface Options {
	readonly menuPosition?: readonly string[];
	readonly text?: string;
}

export async function stationBody(ctx: MyContext, options: Options = {}) {
	const {location, ownPlayerId} = ctx.game;
	if (!isLocationStation(location)) {
		throw new TypeError('not in station');
	}

	const generals = await getPlayerGenerals(ownPlayerId);
	let text = '';

	text += infoline(EMOJIS.station + 'Station', format.underline(`${location.solarsystem} ${getRomanNumber(location.station + 1)}`));
	text += '\n';

	text += infoline(EMOJIS.paperclip + 'Paperclips', generals.paperclips.toFixed(0));

	if (options.menuPosition?.length) {
		const lines = options.menuPosition.map((o, i) => '  '.repeat(i) + format.bold(o));
		text += lines.join('\n');
		text += '\n\n';
	}

	if (options.text) {
		text += options.text;
	}

	return {text, parse_mode: format.parse_mode};
}
