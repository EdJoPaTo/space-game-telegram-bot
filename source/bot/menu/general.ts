import {createBackMainMenuButtons} from 'telegraf-inline-menu';
import {html as format} from 'telegram-format';

import {EMOJIS} from '../emojis.js';
import {getPlayerLocation} from '../../game/get-whatever.js';
import {MyContext} from '../my-context.js';
import {PlayerTelegramIdentifier} from '../../game/types/dynamic/player.js';
import {SiteInfo} from '../../game/types/dynamic/site.js';

export const backButtons = createBackMainMenuButtons<MyContext>(
	context => context.i18n.t('menu.back'),
	context => context.i18n.t('menu.main'),
);

export function choicesByArrayIndex(array: readonly string[]) {
	const result: Record<string, string> = {};
	for (const [index, content] of Object.entries(array)) {
		result[index] = content;
	}

	return result;
}

export function getOwnIdentifier(ctx: MyContext): PlayerTelegramIdentifier {
	const id = ctx.from?.id;
	if (!id) {
		throw new Error('only works when from is defined');
	}

	return `player-tg-${id}`;
}

export async function getOwnLocation(ctx: MyContext) {
	const playerId = getOwnIdentifier(ctx);
	return getPlayerLocation(playerId);
}

export function siteLabel(ctx: MyContext, site: SiteInfo, includeFormat: boolean) {
	const {type, name, unique} = site;
	let label = '';

	label += EMOJIS[type];
	label += ctx.i18n.t(type.startsWith('facility') ? `static.${type}.title` : `siteType.${type}`);

	if (name) {
		label += ' ';
		label += includeFormat ? format.underline(name) : name;
	} else {
		label += ' ';
		label += includeFormat ? format.monospace(unique) : unique;
	}

	return label;
}
