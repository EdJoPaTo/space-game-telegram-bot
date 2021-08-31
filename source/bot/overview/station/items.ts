import {html as format} from 'telegram-format';
import {MenuTemplate} from 'telegraf-inline-menu';
import arrayFilterUnique from 'array-filter-unique';

import {backButtons} from '../../general.js';
import {infoline} from '../../../html-formatted/general.js';
import {Item} from '../../../game/typings.js';
import {MyContext} from '../../my-context.js';
import {SHIP_LAYOUTS} from '../../../game/statics.js';
import {shipLayoutLine} from '../../../html-formatted/ship.js';

import {stationBody} from './body.js';

function getItem(path: string) {
	const item = /items\/i:([^/]+)/.exec(path)![1] as Item;
	return item;
}

async function getItemDetails(ctx: MyContext, path: string) {
	const item = getItem(path);
	const [ship, assets] = await Promise.all([
		ctx.game.getShip(),
		ctx.game.getStationAssets(),
	]);
	const inShip = ship.cargo?.[item] ?? 0;
	const inStation = assets.storage?.[item] ?? 0;
	return {item, inShip, inStation};
}

export const menu = new MenuTemplate<MyContext>(async ctx => {
	let text = '';
	const [ship, assets] = await Promise.all([
		ctx.game.getShip(),
		ctx.game.getStationAssets(),
	]);
	const shipItems = Object.entries(ship.cargo ?? {});
	const stationItems = Object.entries(assets.storage ?? {});

	text += shipLayoutLine(ctx, ship.fitting.layout);
	text += '\n';
	text += shipItems.length > 0 ? shipItems.map(([item, amount]) => `${amount}x ${item}`).join('\n') : format.italic('empty');

	text += '\n\n';
	text += format.bold('Stationhangar');
	text += '\n';
	text += stationItems.length > 0 ? stationItems.map(([item, amount]) => `${amount}x ${item}`).join('\n') : format.italic('empty');

	return stationBody(ctx, {
		menuPosition: ['Items'],
		text,
	});
});

const itemMenu = new MenuTemplate<MyContext>(async (ctx, path) => {
	const {item, inShip, inStation} = await getItemDetails(ctx, path);
	const ship = await ctx.game.getShip();
	const layoutDetails = SHIP_LAYOUTS[ship.fitting.layout]!;
	const title = ctx.i18n.t(`item.${item}.title`);

	let text = '';
	text += ctx.i18n.t(`item.${item}.description`).trim();
	text += '\n\n';

	text += infoline('In Ship', `${inShip} / ${layoutDetails.cargoSlots}`);
	text += infoline('In Station', inStation);

	text += '\n';
	text += 'Market: ';
	text += '/market_' + item;

	return stationBody(ctx, {
		menuPosition: ['Items', title],
		text,
	});
});

async function getItemChoices(ctx: MyContext) {
	const [ship, assets] = await Promise.all([
		ctx.game.getShip(),
		ctx.game.getStationAssets(),
	]);
	const shipItems = Object.keys(ship.cargo ?? {});
	const stationItems = Object.keys(assets.storage ?? {});

	const allItems = [...shipItems, ...stationItems].filter(arrayFilterUnique());
	return allItems;
}

menu.chooseIntoSubmenu('i', getItemChoices, itemMenu, {
	columns: 3,
	getCurrentPage: ctx => ctx.session.page,
	setPage: (ctx, page) => {
		ctx.session.page = page;
	},
});

menu.manualRow(backButtons);

const TRANSFER_CHOICES = {
	l100: '🔟⏫',
	l5: '5️⃣⬆️',
	l1: '1️⃣⬆️',
	u1: '⬇️1️⃣',
	u5: '⬇️5️⃣',
	u100: '⏬🔟',
};

itemMenu.choose('amount', TRANSFER_CHOICES, {
	do: async (ctx, key) => {
		if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
			return true;
		}

		const path = ctx.callbackQuery.data;
		const item = getItem(path);

		const type = key.startsWith('l') ? 'loadItemsIntoShip' : 'unloadItemsFromShip';
		const amount = Number(/\d+/.exec(key)?.[0]);

		await ctx.game.setStationInstructions([{
			type,
			args: {item, amount},
		}]);
		return true;
	},
});

itemMenu.manualRow(backButtons);
