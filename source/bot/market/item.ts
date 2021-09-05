import {Body, MenuTemplate} from 'telegraf-inline-menu';
import {html as format} from 'telegram-format';

import {backButtons} from '../general.js';
import {getItemMarket} from '../../game/backend.js';
import {infoline} from '../../html-formatted/general.js';
import {isPlayerLocationStation, Item} from '../../game/typings.js';
import {itemDescriptionPart, itemLabel} from '../../html-formatted/item.js';
import {itemMarketPart} from '../../html-formatted/market.js';
import {MyContext} from '../my-context.js';

export function getItemFromPath(path: string) {
	return /\/i:([^/]+)/.exec(path)![1] as Item;
}

async function menuBody(ctx: MyContext, path: string): Promise<Body> {
	const item = getItemFromPath(path);
	const {location} = ctx.game;
	let header = format.bold(ctx.i18n.t('market.market')) + ' ' + itemLabel(ctx, item);
	if (isPlayerLocationStation(location)) {
		const {storage} = await ctx.game.getStationAssets();
		header += '\n';
		header += infoline('In Station', storage?.[item] ?? 0);
	}

	const market = await getItemMarket(item);

	const parts: string[] = [
		header.trim(),
		itemMarketPart(market, location, Boolean(ctx.session.marketFilterSameStation)),
		ctx.i18n.t('market.itemHelp'),
	];
	const text = parts.map(o => o.trim()).join('\n\n');
	return {text, parse_mode: 'HTML'};
}

export const menu = new MenuTemplate<MyContext>(menuBody);

const detailsMenu = new MenuTemplate<MyContext>((ctx, path) => {
	const item = getItemFromPath(path);
	let text = format.bold(ctx.i18n.t('market.market')) + ' ' + itemLabel(ctx, item);
	text += '\n\n';
	text += itemDescriptionPart(ctx, item);
	return {text, parse_mode: 'HTML'};
});
detailsMenu.manualRow(backButtons);

menu.toggle('Same Station', 'same', {
	hide: ctx => !isPlayerLocationStation(ctx.game.location),
	isSet: ctx => Boolean(ctx.session.marketFilterSameStation),
	set: (ctx, newState) => {
		ctx.session.marketFilterSameStation = newState;
		return true;
	},
});

menu.submenu(ctx => ctx.i18n.t('market.itemDescription'), 'd', detailsMenu);

menu.manualRow(backButtons);
