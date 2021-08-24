import {html as format} from 'telegram-format';

import {getSiteInstructions} from '../../../game/backend.js';
import {isLocationSite} from '../../../game/typing-checks.js';
import {MyContext} from '../../my-context.js';

export interface Options {
	readonly planned?: true;

	readonly menuPosition?: readonly string[];
	readonly text?: string;
}

export async function siteBody(ctx: MyContext, options: Options = {}) {
	let text = '';
	const {location, ownPlayerId} = ctx.game;
	if (!isLocationSite(location)) {
		throw new Error('siteBody called out of site');
	}

	if (options.planned) {
		const planned = await getSiteInstructions(ownPlayerId);
		text += '📝planned actions:\n';
		text += planned.length > 0 ? planned.map(o => format.monospace(JSON.stringify(o))).join('\n') : 'none';
		text += '\n\n';
	}

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
