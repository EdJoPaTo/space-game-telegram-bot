import {readFileSync} from 'fs';

import {generateUpdateMiddleware} from 'telegraf-middleware-console-time';
import {MenuMiddleware} from 'telegraf-inline-menu';
import {Telegraf} from 'telegraf';
import {RequestError} from 'got';
import TelegrafSessionLocal from 'telegraf-session-local';

import {bot as marketBot} from './market/index.js';
import {ContextGameProperty} from './overview/context-game-property.js';
import {i18n} from './i18n.js';
import {menu as overviewMenu} from './overview/index.js';
import {menu as settingsMenu} from './settings/index.js';
import {MyContext} from './my-context.js';

const token = process.env['BOT_TOKEN'];
if (!token) {
	throw new Error('You have to provide the bot-token from @BotFather via environment variable (BOT_TOKEN)');
}

const ALLOWED = readFileSync('persist/allowed.txt', 'utf8').split('\n').map(o => Number(/^\d+/.exec(o)?.[0])).filter(o => o);
console.log('ALLOWED', ALLOWED);

const bot = new Telegraf<MyContext>(token);

bot.use(async (ctx, next) => {
	if (ctx.from?.id && ALLOWED.includes(ctx.from.id)) {
		return next();
	}

	console.log('NOT ALLOWED', ctx.from);

	await ctx.reply('This game is currently in a closed alpha.\n\nOur highly trained magicans are trying to hide the bugs as we speak. There is no waitlist yet. In order to participate in the closed alpha you probably need to know the magicians.');
});

const localSession = new TelegrafSessionLocal({
	database: 'persist/sessions.json',
});

bot.use(localSession.middleware());

bot.use(i18n.middleware());

if (process.env['NODE_ENV'] !== 'production') {
	bot.use(generateUpdateMiddleware());
}

bot.command('help', async context => context.reply(context.i18n.t('help.main')));

const settingsMenuMiddleware = new MenuMiddleware('settings/', settingsMenu);
bot.command('settings', async context => settingsMenuMiddleware.replyToContext(context));
bot.use(settingsMenuMiddleware.middleware());

bot.use(async (ctx, next) => {
	if (ctx.from) {
		const game = await ContextGameProperty.generate(ctx.from.id);
		// @ts-expect-error set readonly value
		ctx.game = game;
	}

	return next();
});

bot.use(marketBot);

const stationMiddleware = new MenuMiddleware('overview/', overviewMenu);
bot.command('start', async context => stationMiddleware.replyToContext(context));
bot.use(stationMiddleware);

bot.catch(async (error, ctx) => {
	if (error instanceof RequestError) {
		console.log('backend error occured', error.message);
	} else {
		console.error('telegraf error occured', error);
	}

	try {
		await ctx.reply('Ouh… some Error happened. Everyone still alive?');
	} catch {}
});

export async function initBot() {
	await bot.telegram.setMyCommands([
		{command: 'start', description: 'open the overview'},
		{command: 'help', description: 'show the help'},
		{command: 'settings', description: 'open the settings'},
		// TODO: privacy
		{command: 'market', description: '{item} - open the market for a given item'},
		{command: 'wtb', description: '{item} {amount} {price} - place a buy order at your current station'},
		{command: 'wts', description: '{item} {amount} {price} - place a sell order at your current station'},
	]);

	return bot.telegram;
}

export async function startBot() {
	await bot.launch();
	console.log(new Date(), 'Bot started as', bot.botInfo?.username);
}
