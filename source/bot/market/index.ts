import {Composer} from 'telegraf';
import {Body, MenuMiddleware, MenuTemplate} from 'telegraf-inline-menu';
import {html as format} from 'telegram-format';

import {getItemMarket} from '../../game/backend.js';
import {isPlayerLocationStation, Item} from '../../game/typings.js';
import {itemMarketPart} from '../../html-formatted/market.js';
import {MyContext} from '../my-context.js';

export const MARKET_MENU_TRIGGER = /^market([^/]+)\//;
export function getItemFromPath(path: string) {
	return MARKET_MENU_TRIGGER.exec(path)![1]!.replace(/_/g, '').trim() as Item;
}

async function menuBody(ctx: MyContext, path: string): Promise<Body> {
	const item = getItemFromPath(path);
	const {location} = ctx.game;
	const headline = format.bold('Market') + ' ' + item;

	const market = await getItemMarket(item);

	const parts: string[] = [
		headline,
		itemMarketPart(market, location, Boolean(ctx.session.marketFilterSameStation)),
	];
	const text = parts.join('\n\n');

	return {text, parse_mode: 'HTML'};
}

const menu = new MenuTemplate(menuBody);

menu.toggle('Same Station', 'same', {
	hide: ctx => !isPlayerLocationStation(ctx.game.location),
	isSet: ctx => Boolean(ctx.session.marketFilterSameStation),
	set: (ctx, newState) => {
		ctx.session.marketFilterSameStation = newState;
		return true;
	},
});

export const bot = new Composer<MyContext>();
const menuMiddleware = new MenuMiddleware(MARKET_MENU_TRIGGER, menu);
bot.use(menuMiddleware);

bot.hears(/^\/market.(\w+)$/, async (ctx, next) => {
	try {
		const item = ctx.match[1]!.trim() as Item;
		await menuMiddleware.replyToContext(ctx, `market${item}/`);
	} catch (error: unknown) {
		console.log('Market command error. Command:', ctx.message.text, 'Error:', error instanceof Error ? error.message : error);
		return next();
	}
});

bot.command('market', async ctx => ctx.reply(ctx.i18n.t('help.marketCommand')));

bot.hears(/^\/wtb.(\w+).(\d+).(\d+)$/, async (ctx, next) => {
	if (!isPlayerLocationStation(ctx.game.location)) {
		return ctx.reply(ctx.i18n.t('help.marketDocked'));
	}

	try {
		const item = ctx.match[1]!.trim() as Item;
		const amount = Number(ctx.match[2]);
		const paperclips = Number(ctx.match[3]);

		if (paperclips <= 1) {
			return ctx.reply(ctx.i18n.t('help.wtbPrice1'));
		}

		await ctx.game.setStationInstructions([{
			type: 'buy',
			args: {item, amount, paperclips},
		}]);
		return ctx.reply(ctx.i18n.t('help.wtbSuccessful'));
	} catch (error: unknown) {
		console.log('Market command error. Command:', ctx.message.text, 'Error:', error instanceof Error ? error.message : error);
		return next();
	}
});

bot.hears(/^\/wts.(\w+).(\d+).(\d+)$/, async (ctx, next) => {
	if (!isPlayerLocationStation(ctx.game.location)) {
		return ctx.reply(ctx.i18n.t('help.marketDocked'));
	}

	try {
		const item = ctx.match[1]!.trim() as Item;
		const amount = Number(ctx.match[2]);
		const paperclips = Number(ctx.match[3]);

		await ctx.game.setStationInstructions([{
			type: 'sell',
			args: {item, amount, paperclips},
		}]);
		return ctx.reply(ctx.i18n.t('help.wtbSuccessful'));
	} catch (error: unknown) {
		console.log('Market command error. Command:', ctx.message.text, 'Error:', error instanceof Error ? error.message : error);
		return next();
	}
});

bot.hears(/^\/wt/, async ctx => ctx.reply(ctx.i18n.t('help.wtbCommand'), {parse_mode: 'HTML'}));
