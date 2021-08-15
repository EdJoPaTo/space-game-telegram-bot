import {html as format} from 'telegram-format';
import {MenuTemplate} from 'telegraf-inline-menu';

import {addSiteInstructions, getSites} from '../../../game/get-whatever.js';
import {backButtons, getOwnIdentifier, getOwnLocation, siteLabel} from '../general.js';
import {isLocationSite} from '../../../game/typing-checks.js';
import {menuBody} from '../body.js';
import {MyContext} from '../../my-context.js';
import {Site, Solarsystem} from '../../../game/typings.js';
import {SOLARSYSTEMS} from '../../../game/get-static.js';

async function warpMenuBody(ctx: MyContext) {
	const location = await getOwnLocation(ctx);
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

	const location = await getOwnLocation(ctx);
	const allSites = await getSites(location.solarsystem);
	const sites = Object.values(allSites)
		.flat()
		.filter((o): o is Site => Boolean(o))
		.filter(o => o.kind !== currentLocation.site.kind || o.unique !== currentLocation.site.unique);
	const result: Record<string, string> = {};
	for (const site of sites) {
		const key = `${site.kind}-${site.unique}`;
		result[key] = siteLabel(ctx, location.solarsystem, site, false);
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

		const splitted = key.split('-');
		const kind = splitted[0] as Site['kind'];
		const unique = (splitted[1] && Object.keys(SOLARSYSTEMS).includes(splitted[1]))
			? splitted[1] as Solarsystem
			: Number(splitted[1]);

		await addSiteInstructions(getOwnIdentifier(ctx), [{
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			type: 'warp', args: {target: {kind, unique: unique as any}},
		}]);
		await ctx.answerCbQuery('added to planned actions');
		return '..';
	},
});

menu.manualRow(backButtons);
