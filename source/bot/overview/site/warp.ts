import {html as format} from 'telegram-format';
import {MenuTemplate} from 'telegraf-inline-menu';

import {backButtons} from '../../general.js';
import {EMOJIS} from '../../../html-formatted/emojis.js';
import {getSites} from '../../../game/backend.js';
import {isPlayerLocationSite, Site, Solarsystem} from '../../../game/typings.js';
import {MyContext} from '../../my-context.js';
import {siteLabel} from '../../../html-formatted/site.js';
import {SOLARSYSTEMS} from '../../../game/statics.js';

import {siteBody} from './body.js';

async function warpMenuBody(ctx: MyContext) {
	const {location} = ctx.game;
	const allSites = await getSites(location.solarsystem);

	let text = '';
	for (const [planet, sites] of Object.entries(allSites)) {
		if (sites) {
			text += format.italic(`Planet ${planet}`);
			text += '\n';
			text += sites
				.map(site => siteLabel(ctx, location.solarsystem, site, true))
				.map(o => '   ' + o)
				.join('\n');
			text += '\n';
		}
	}

	return siteBody(ctx, {
		menuPosition: [EMOJIS.warp + ctx.i18n.t('warp.initiate')],
		text,
	});
}

async function getSiteChoices(ctx: MyContext) {
	if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
		throw new Error('that shouldnt happen');
	}

	const {location: currentLocation} = ctx.game;
	if (!isPlayerLocationSite(currentLocation)) {
		// Not in a site → cant warp anyway
		return [];
	}

	const allSites = await getSites(currentLocation.solarsystem);
	const sites = Object.values(allSites)
		.flat()
		.filter((o): o is Site => Boolean(o))
		.filter(o => o.kind !== currentLocation.site.kind || o.unique !== currentLocation.site.unique);
	const result: Record<string, string> = {};
	for (const site of sites) {
		const key = `${site.kind}-${site.unique}`;
		result[key] = siteLabel(ctx, currentLocation.solarsystem, site, false);
	}

	return result;
}

export const menu = new MenuTemplate(warpMenuBody);

menu.choose('site', getSiteChoices, {
	columns: 2,
	do: async (ctx, key) => {
		if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
			throw new Error('that shouldnt happen');
		}

		await ctx.answerCbQuery();
		const splitted = key.split('-');
		const kind = splitted[0] as Site['kind'];
		const unique = (splitted[1] && Object.keys(SOLARSYSTEMS).includes(splitted[1]))
			? splitted[1] as Solarsystem
			: Number(splitted[1]);

		await ctx.game.addSiteInstructions([{
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			type: 'warp', args: {target: {kind, unique: unique as any}},
		}]);
		await ctx.editMessageText(ctx.i18n.t('warp.starting'));
		return false;
	},
});

menu.manualRow(backButtons);
