import {Composer} from 'telegraf';
import {Body, MenuMiddleware, MenuTemplate} from 'telegraf-inline-menu';
import {html as format} from 'telegram-format';

import {getItemMarket} from '../../game/backend.js';
import {isPlayerLocationStation, Item} from '../../game/typings.js';
import {itemMarketPart} from '../../html-formatted/market.js';
import {MyContext} from '../my-context.js';

async function menuBody(ctx: MyContext, path: string): Promise<Body> {
	const item = menuTrigger.exec(path)![1]!.replace(/_/g, '').trim() as Item;
	const {location} = ctx.game;
	const headline = format.bold('Market') + ' ' + item;

	const market = await getItemMarket(item)

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
const menuTrigger = /^market([^/]+)\//;
const menuMiddleware = new MenuMiddleware(menuTrigger, menu);
bot.use(menuMiddleware);

bot.hears(/^\/market(.+)/, async ctx => {
	const item = ctx.match[1]!.replace(/_/g, '').trim() as Item;
	return menuMiddleware.replyToContext(ctx, `market${item}/`);
});

bot.command('market', async ctx => {
	let text = '';
	text += 'You can inspect the market of a specific item with this command.';
	text += '\n';
	text += 'Here you can buy items. If you wish to sell items go to your hangar in your station';
	text += '\n\n';
	text += 'Supply one argument with the item name you want to inspect. This will look somewhat like this:';
	text += '\n';
	text += '/market_Aromit';
	return ctx.reply(text);
});
