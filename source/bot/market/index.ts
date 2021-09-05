import {Composer} from 'telegraf';
import {MenuMiddleware, MenuTemplate} from 'telegraf-inline-menu';
import {html as format} from 'telegram-format';

import {backButtons} from '../general.js';
import {EMOJIS} from '../../html-formatted/emojis.js';
import {isPlayerLocationStation, Item, ItemCategory} from '../../game/typings.js';
import {itemLabel} from '../../html-formatted/item.js';
import {ITEMS_BY_CATEGORY} from '../../game/statics.js';
import {MyContext} from '../my-context.js';
import {typedKeys} from '../../javascript-helper.js';

import {menu as itemMenu} from './item.js';

export const MARKET_MENU_TRIGGER = /^market([^/]+)\//;
export function getItemFromPath(path: string) {
	return MARKET_MENU_TRIGGER.exec(path)![1]!.replace(/_/g, '').trim() as Item;
}

const menu = new MenuTemplate<MyContext>(ctx => {
	let text = '';
	text += format.bold(ctx.i18n.t('market.market'));
	text += '\n\n';
	text += ctx.i18n.t('market.help');
	return {text, parse_mode: 'HTML'};
});

const categoryMenu = new MenuTemplate<MyContext>((ctx, path) => {
	const category = /\/c:([^/]+)/.exec(path)![1] as ItemCategory;
	let text = '';
	text += format.bold(ctx.i18n.t('market.market'));
	text += '\n    ';
	text += EMOJIS[category];
	text += ctx.i18n.t(`itemCategory.${category}.title`);
	text += '\n\n';
	text += ctx.i18n.t(`itemCategory.${category}.description`).trim();
	return {text, parse_mode: 'HTML'};
});

function itemCategoryChoices(ctx: MyContext) {
	const result: Record<string, string> = {};
	for (const category of typedKeys(ITEMS_BY_CATEGORY)) {
		result[category] = EMOJIS[category] + ctx.i18n.t(`itemCategory.${category}.title`);
	}

	return result;
}

menu.chooseIntoSubmenu('c', itemCategoryChoices, categoryMenu, {
	columns: 2,
});

function itemOfCategoryChoices(ctx: MyContext) {
	if (!('data' in ctx.callbackQuery!)) {
		throw new Error('wat?');
	}

	const path = ctx.callbackQuery.data;

	const category = /\/c:([^/]+)/.exec(path)![1] as ItemCategory;
	const result: Record<string, string> = {};

	const items = ITEMS_BY_CATEGORY[category] ?? [];
	for (const item of items) {
		result[item] = itemLabel(ctx, item);
	}

	return result;
}

categoryMenu.chooseIntoSubmenu('i', itemOfCategoryChoices, itemMenu, {
	columns: 2,
	getCurrentPage: ctx => ctx.session.page,
	setPage: (ctx, page) => {
		ctx.session.page = page;
	},
});

categoryMenu.manualRow(backButtons);

export const bot = new Composer<MyContext>();
const menuMiddleware = new MenuMiddleware('m/', menu);
bot.use(menuMiddleware);
bot.command('market', async ctx => menuMiddleware.replyToContext(ctx));

bot.hears(/^\/wtb.(\w+).(\d+).(\d+)$/, async (ctx, next) => {
	if (!isPlayerLocationStation(ctx.game.location)) {
		return ctx.reply(ctx.i18n.t('market.docked'));
	}

	try {
		const item = ctx.match[1]!.trim() as Item;
		const amount = Number(ctx.match[2]);
		const paperclips = Number(ctx.match[3]);

		if (paperclips <= 1) {
			await ctx.reply(ctx.i18n.t('market.wtbPrice1'));
			return;
		}

		await ctx.game.setStationInstructions([{
			type: 'buy',
			args: {item, amount, paperclips},
		}]);
		await ctx.reply(ctx.i18n.t('market.wtbSuccessful'));
	} catch (error: unknown) {
		console.log('Market command error. Command:', ctx.message.text, 'Error:', error instanceof Error ? error.message : error);
		return next();
	}
});

bot.hears(/^\/wts.(\w+).(\d+).(\d+)$/, async (ctx, next) => {
	if (!isPlayerLocationStation(ctx.game.location)) {
		return ctx.reply(ctx.i18n.t('market.docked'));
	}

	try {
		const item = ctx.match[1]!.trim() as Item;
		const amount = Number(ctx.match[2]);
		const paperclips = Number(ctx.match[3]);

		await ctx.game.setStationInstructions([{
			type: 'sell',
			args: {item, amount, paperclips},
		}]);
		await ctx.reply(ctx.i18n.t('market.wtbSuccessful'));
	} catch (error: unknown) {
		console.log('Market command error. Command:', ctx.message.text, 'Error:', error instanceof Error ? error.message : error);
		return next();
	}
});

bot.hears(/^\/wt/, async ctx => ctx.reply(ctx.i18n.t('market.wtbCommand'), {parse_mode: 'HTML'}));
