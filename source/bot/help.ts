import {Composer} from 'telegraf';
import {I18nContextFlavour, MyContext} from './my-context.js';

export const bot = new Composer<MyContext>();

function generateKeyboard(ctx: I18nContextFlavour) {
	return [
		[
			generateButton(ctx, 'gettingStarted'),
		],
		[
			generateButton(ctx, 'beingInSpace'),
			generateButton(ctx, 'stations'),
		],
		[
			generateButton(ctx, 'shipFittings'),
		],
	];
}

function generateButton(ctx: I18nContextFlavour, topic: string) {
	return {
		text: ctx.i18n.t(`help.${topic}.title`),
		callback_data: `help/${topic}`,
	};
}

function generateText(ctx: I18nContextFlavour, topic = 'overview') {
	const title = ctx.i18n.t(`help.${topic}.title`);
	const text = ctx.i18n.t(`help.${topic}.text`);
	return title + '\n\n' + text;
}

bot.action(/^help\/(.*)$/, async ctx => {
	const topic = ctx.match?.[1] ?? 'overview';
	const text = generateText(ctx, topic);
	await ctx.answerCbQuery();
	try {
		await ctx.editMessageText(text, {
			reply_markup: {inline_keyboard: generateKeyboard(ctx)},
		});
	} catch (error: unknown) {
		if (error instanceof Error && error.message.includes('message is not modified')) {
			return;
		}

		throw error;
	}
});

bot.command('help', async ctx => {
	const text = generateText(ctx);
	return ctx.reply(text, {
		reply_markup: {inline_keyboard: generateKeyboard(ctx)},
	});
});
