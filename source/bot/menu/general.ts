import {createBackMainMenuButtons} from 'telegraf-inline-menu';
import {html as format} from 'telegram-format';

import {EMOJIS, getRomanNumber} from '../emojis.js';
import {getPlayerLocation, getPlayerShip} from '../../game/get-whatever.js';
import {MyContext} from '../my-context.js';
import {Player, Site, Solarsystem} from '../../game/typings.js';

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

export function siteLabel(ctx: MyContext, solarsystem: Solarsystem, site: Site, includeFormat: boolean) {
	let label = '';

	label += EMOJIS[site.kind];
	label += ctx.i18n.t(`static.${site.kind}.title`);
	label += ' ';

	if (site.kind === 'station') {
		const value = `${solarsystem} ${getRomanNumber(site.unique + 1)}`;
		label += includeFormat ? format.underline(value) : value;
	} else if (site.kind === 'stargate') {
		label += includeFormat ? format.underline(site.unique) : site.unique;
	} else {
		let value = site.unique.toString(16);
		while (value.length < 2) {
			value = '0' + value;
		}

		label += includeFormat ? format.monospace(value) : value;
	}

	return label;
}
