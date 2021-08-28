import {generateSendMenuToChatFunction} from 'telegraf-inline-menu';
import {Telegram} from 'telegraf';

import {addOpenOverviews, popOpenOverviews} from '../persist-data/overviews.js';
import {ContextGameProperty} from '../bot/overview/context-game-property.js';
import {entityPart} from '../html-formatted/site.js';
import {generateHtmlLog} from '../html-formatted/site-log.js';
import {i18n} from '../bot/i18n.js';
import {locationPart} from '../html-formatted/location.js';
import {menu as overviewMenu} from '../bot/overview/index.js';
import {shipStatsPart} from '../html-formatted/ship.js';
import {sleep} from '../javascript-helper.js';

import {getPlayersWithSiteLog, getSiteEntities, getSiteLog} from './backend.js';
import {isPlayerLocationSite, isPlayerLocationWarp, Player} from './typings.js';

export async function startSiteLogLoop(telegram: Telegram) {
	await once(telegram);

	void theLoop(telegram);
}

async function theLoop(telegram: Telegram) {
	while (true) {
		// eslint-disable-next-line no-await-in-loop
		await sleep(1000);
		try {
		// eslint-disable-next-line no-await-in-loop
			await once(telegram);
		} catch (error: unknown) {
			console.error('site-log-loop ERROR', error);
		}
	}
}

async function once(telegram: Telegram) {
	const players = await getPlayersWithSiteLog();
	for (const player of players) {
		// eslint-disable-next-line no-await-in-loop
		await handlePlayer(telegram, player);
	}
}

async function handlePlayer(telegram: Telegram, player: Player) {
	const log = await getSiteLog(player);
	if (log.length > 0) {
		const openOverviews = await popOpenOverviews(player.id);
		await Promise.all(openOverviews.map(async o => {
			try {
				await telegram.editMessageReplyMarkup(player.id, o, undefined, undefined);
			} catch {}
		}));

		const game = await ContextGameProperty.generate(player.id);
		const ctx = {
			from: {id: player.id},
			i18n: i18n.createContext('en', {}),
			game,
		};
		const {location} = game;
		const textParts: string[] = [
			await generateHtmlLog(ctx, log),
		];

		if (isPlayerLocationSite(location) || isPlayerLocationWarp(location)) {
			textParts.push(await locationPart(ctx, location));

			const ship = await game.getShip();
			textParts.push(shipStatsPart(ctx, ship));
		}

		if (isPlayerLocationSite(location)) {
			const entities = await getSiteEntities(location.solarsystem, location.site);
			textParts.push((await entityPart(ctx, entities)));
		}

		const text = textParts.join('\n\n');
		await sendHtmlWithRetry(telegram, player.id, text);

		await sendOverviewWithRetry(telegram, player.id, ctx);
	}
}

async function sendHtmlWithRetry(telegram: Telegram, target: number, html: string) {
	// TODO: catch rate limit error and wait for n seconds before trying again
	try {
		await telegram.sendMessage(target, html, {parse_mode: 'HTML'});
	} catch (error: unknown) {
		console.log('site-log-loop sendHtmlWithRetry ERROR', error instanceof Error ? error.message : error);
	}
}

async function sendOverviewWithRetry(telegram: Telegram, target: number, ctx: any) {
	const sendMenu = generateSendMenuToChatFunction(telegram, overviewMenu, 'overview/');
	// TODO: catch rate limit error and wait for n seconds before trying again
	try {
		const message = await sendMenu(target, ctx);
		await addOpenOverviews(target, message.message_id);
	} catch (error: unknown) {
		console.log('site-log-loop sendOverviewWithRetry ERROR', error instanceof Error ? error.message : error);
	}
}
