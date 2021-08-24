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
	const {location, ownPlayerId} = ctx.game;
	if (!isLocationSite(location)) {
		throw new Error('siteBody called out of site');
	}

	const parts: string[] = [];

	const planned = await getSiteInstructions(ownPlayerId);
	if (options.planned && planned.length > 0) {
		let text = '';
		text += '📝planned actions:\n';
		text += planned.map(o => format.monospace(JSON.stringify(o))).join('\n');
		parts.push(text);
	}

	if (options.menuPosition?.length) {
		const lines = options.menuPosition.map((o, i) => '  '.repeat(i) + format.bold(o));
		parts.push(lines.join('\n'));
	}

	if (options.text) {
		parts.push(options.text);
	}

	if (options.planned && planned.length > 0 && parts.length === 1) {
		parts.push('These actions will be executed soon…');
	}

	if (parts.length === 0) {
		parts.push('What do you want to do?');
	}

	return {
		text: parts.join('\n\n'),
		parse_mode: format.parse_mode,
	};
}
