import {html as format} from 'telegram-format';
import {MenuTemplate} from 'telegraf-inline-menu';
import arrayFilterUnique from 'array-filter-unique';

import {backButtons} from '../../general.js';
import {getCargoSlotsUsed} from '../../../game/ship-math.js';
import {infoline} from '../../../html-formatted/general.js';
import {Item} from '../../../game/typings.js';
import {itemAmountLabel, itemLabel} from '../../../html-formatted/market.js';
import {ITEMS, SHIP_LAYOUTS} from '../../../game/statics.js';
import {MyContext} from '../../my-context.js';
import {shipLayoutLine} from '../../../html-formatted/ship.js';
import {typedEntities, typedKeys} from '../../../javascript-helper.js';

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
	const shipItems = typedEntities(ship.cargo ?? {});
	const stationItems = typedEntities(assets.storage ?? {});

	text += shipLayoutLine(ctx, ship.fitting.layout);
	text += '\n';
	text += shipItems.length > 0 ? shipItems.map(([item, amount]) => itemAmountLabel(ctx, item, amount)).join('\n') : format.italic('empty');

	text += '\n\n';
	text += format.bold('Stationhangar');
	text += '\n';
	text += stationItems.length > 0 ? stationItems.map(([item, amount]) => itemAmountLabel(ctx, item, amount)).join('\n') : format.italic('empty');

	return stationBody(ctx, {
		menuPosition: ['Items'],
		text,
	});
});

const itemMenu = new MenuTemplate<MyContext>(async (ctx, path) => {
	const {item, inShip, inStation} = await getItemDetails(ctx, path);
	const ship = await ctx.game.getShip();
	const layoutDetails = SHIP_LAYOUTS[ship.fitting.layout]!;
	const title = itemLabel(ctx, item);

	let text = '';
	text += ctx.i18n.t(`item.${item}.description`).trim();
	text += '\n\n';

	text += infoline('Ship Cargo', `${getCargoSlotsUsed(ship.cargo)} / ${layoutDetails.cargoSlots}`);
	text += '\n';

	text += infoline('In Ship', inShip);
	text += infoline('In Station', inStation);

	text += '\n';
	text += 'Market: ';
	text += '/market_' + item;

	return stationBody(ctx, {
		menuPosition: ['Items', title],
		text,
	});
});

const recycleMenu = new MenuTemplate<MyContext>(async (ctx, path) => {
	const {item, inStation} = await getItemDetails(ctx, path);
	const title = itemLabel(ctx, item);
	const details = ITEMS[item]!;
	const recycleItems = typedEntities(details.recycle);

	let text = '';
	text += infoline('In Station', inStation);
	text += '\n';

	text += 'Recycling one item will return you with the following materials:';
	text += '\n';
	text += recycleItems.map(([item, amount]) => itemAmountLabel(ctx, item, amount)).join('\n');
	text += '\n\n';

	text += 'How many do you want to recycle?';

	return stationBody(ctx, {
		menuPosition: ['Items', title, 'Recycle'],
		text,
	});
});

async function getItemChoices(ctx: MyContext) {
	const [ship, assets] = await Promise.all([
		ctx.game.getShip(),
		ctx.game.getStationAssets(),
	]);
	const shipItems = typedKeys(ship.cargo ?? {});
	const stationItems = typedKeys(assets.storage ?? {});

	const allItems = [...shipItems, ...stationItems].filter(arrayFilterUnique());
	const labeled: Partial<Record<Item, string>> = {};
	for (const item of allItems) {
		labeled[item] = itemLabel(ctx, item);
	}

	return labeled;
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
	l10: '🔟⏫',
	l5: '5️⃣⬆️',
	l1: '1️⃣⬆️',
	u1: '⬇️1️⃣',
	u5: '⬇️5️⃣',
	u10: '⏬🔟',
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

itemMenu.submenu('Recycle', 'recycle', recycleMenu, {
	hide: async (_ctx, path) => {
		const item = getItem(path);
		const details = ITEMS[item]!;
		return Object.keys(details.recycle).length === 0;
	},
});

itemMenu.manualRow(backButtons);

const RECYCLE_CHOICES = {
	1: '1️⃣',
	5: '5️⃣',
	10: '🔟',
};

recycleMenu.choose('a', RECYCLE_CHOICES, {
	do: async (ctx, key) => {
		if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
			return true;
		}

		const path = ctx.callbackQuery.data;
		const item = getItem(path);
		const amount = Number(key);

		await ctx.game.setStationInstructions([{
			type: 'recycle',
			args: {item, amount},
		}]);

		return true;
	},
});

recycleMenu.manualRow(backButtons);
