import {readFileSync} from 'fs';

import {generateUpdateMiddleware} from 'telegraf-middleware-console-time';
import {MenuMiddleware} from 'telegraf-inline-menu';
import {Telegraf} from 'telegraf';
import TelegrafSessionLocal from 'telegraf-session-local';

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

bot.command('help', async context => context.reply(context.i18n.t('help')));

const overviewMiddleware = new MenuMiddleware('overview/', overviewMenu);
bot.command('start', async context => overviewMiddleware.replyToContext(context));
bot.action('/', async context => overviewMiddleware.replyToContext(context));
bot.use(overviewMiddleware.middleware());

const settingsMenuMiddleware = new MenuMiddleware('settings/', settingsMenu);
bot.command('settings', async context => settingsMenuMiddleware.replyToContext(context));
bot.use(settingsMenuMiddleware.middleware());

bot.catch(error => {
	console.error('telegraf error occured', error);
});

export async function initBot() {
	await bot.telegram.setMyCommands([
		{command: 'start', description: 'open the menu'},
		{command: 'help', description: 'show the help'},
		{command: 'settings', description: 'open the settings'},
	]);

	return bot.telegram;
}

export async function startBot() {
	await bot.launch();
	console.log(new Date(), 'Bot started as', bot.botInfo?.username);
}
