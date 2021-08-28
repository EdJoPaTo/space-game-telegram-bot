import {html as format} from 'telegram-format';

import {getSites} from '../game/backend.js';
import {I18nContextFlavour} from '../bot/my-context.js';
import {isPlayerLocationSite, isPlayerLocationStation, PlayerLocationSite, PlayerLocationWarp, Site} from '../game/typings.js';
import {SOLARSYSTEMS} from '../game/statics.js';

import {EMOJIS, getRomanNumber} from './emojis.js';
import {siteLabel} from './site.js';

export async function locationPart(ctx: I18nContextFlavour, location: PlayerLocationSite | PlayerLocationWarp) {
	let text = '';

	const solarsystemInfo = SOLARSYSTEMS[location.solarsystem]!;
	text += infoline(EMOJIS.solarsystem + 'Solarsystem', format.underline(location.solarsystem));
	text += infoline(EMOJIS.security + 'Security', `${solarsystemInfo.security}%`);

	if (isPlayerLocationStation(location)) {
		text += infoline(EMOJIS.station + 'Station', `${location.solarsystem} ${getRomanNumber(location.station + 1)}`);
	} else if (isPlayerLocationSite(location)) {
		const allSites = await getSites(location.solarsystem);
		const site = Object.values(allSites).flat()
			.filter((o): o is Site => Boolean(o))
			.find(o => o.kind === location.site.kind && o.unique === location.site.unique);
		const value = site ? siteLabel(ctx, location.solarsystem, site, true) : 'Destination unknown';
		text += infoline(EMOJIS.location + 'Site', value);
	} else {
		text += EMOJIS.location + 'In Warp\n';
	}

	return text.trim();
}

function infoline(title: string, value: string): string {
	return format.italic(title) + ': ' + value + '\n';
}
