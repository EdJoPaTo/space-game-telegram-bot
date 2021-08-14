import {createBackMainMenuButtons} from 'telegraf-inline-menu';
import {html as format} from 'telegram-format';

import {EMOJIS} from '../emojis.js';
import {getPlayerLocation, getPlayerShip} from '../../game/get-whatever.js';
import {MyContext} from '../my-context.js';
import {Player, SiteInfo} from '../../game/typings.js';

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

export function getOwnIdentifier(ctx: MyContext): Player {
	const id = ctx.from?.id;
	if (!id) {
		throw new Error('only works when from is defined');
	}

	return {platform: 'telegram', id};
}

export async function getOwnLocation(ctx: MyContext) {
	const ownPlayerId = getOwnIdentifier(ctx);
	return getPlayerLocation(ownPlayerId);
}

export async function getOwnShip(ctx: MyContext) {
	const ownPlayerId = getOwnIdentifier(ctx);
	return getPlayerShip(ownPlayerId);
}

export function siteLabel(ctx: MyContext, site: SiteInfo, includeFormat: boolean) {
	const {kind, name, siteUnique} = site;
	let label = '';

	label += EMOJIS[kind];
	label += ctx.i18n.t(`static.${kind}.title`);

	if (name) {
		label += ' ';
		label += includeFormat ? format.underline(name) : name;
	} else {
		label += ' ';
		label += includeFormat ? format.monospace(siteUnique) : siteUnique;
	}

	return label;
}
