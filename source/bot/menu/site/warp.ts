import {html as format} from 'telegram-format';
import {MenuTemplate} from 'telegraf-inline-menu';

import {backButtons, getOwnLocation, siteLabel} from '../general.js';
import {getSites} from '../../../game/get-whatever.js';
import {isLocationSite} from '../../../game/typing-checks.js';
import {menuBody} from '../body.js';
import {MyContext} from '../../my-context.js';

async function getLocalSites(ctx: MyContext) {
	const location = await getOwnLocation(ctx);
	return getSites(location.solarsystem);
}

async function warpMenuBody(ctx: MyContext) {
	const allSites = await getLocalSites(ctx);

	let text = '';
	for (const [planet, sites] of Object.entries(allSites)) {
		text += format.italic(`Planet ${planet}`);
		text += '\n';
		text += sites
			.map(site => siteLabel(ctx, site, true))
			.map(o => '   ' + o)
			.join('\n');
		text += '\n';
	}

	return menuBody(ctx, {
		menuPosition: ['Initiate Warp'],
		text,
	});
}

async function getSiteChoices(ctx: MyContext) {
	if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
		throw new Error('that shouldnt happen');
	}

	const currentLocation = await getOwnLocation(ctx);
	if (!isLocationSite(currentLocation)) {
		// Not in a site → cant warp anyway
		return [];
	}

	const allSites = await getLocalSites(ctx);
	const sites = Object.values(allSites)
		.flat()
		.filter(o => o.unique !== currentLocation.siteUnique);
	const result: Record<string, string> = {};
	for (const site of sites) {
		result[site.unique] = siteLabel(ctx, site, false);
	}

	return result;
}

export const menu = new MenuTemplate(warpMenuBody);

menu.choose('site', getSiteChoices, {
	columns: 2,
	do: async (ctx, siteUnique) => {
		if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
			throw new Error('that shouldnt happen');
		}

		ctx.session.planned = [{type: 'warp', siteUnique}];
		await ctx.answerCbQuery('added to planned actions');
		return '..';
	},
});

menu.manualRow(backButtons);
