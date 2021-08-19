import {html as format} from 'telegram-format';

import {I18nContextFlavour} from '../bot/my-context.js';
import {Site, Solarsystem} from '../game/typings.js';

import {EMOJIS, getRomanNumber} from './emojis.js';

export function siteLabel(ctx: I18nContextFlavour, solarsystem: Solarsystem, site: Site, includeFormat: boolean) {
	let label = '';

	label += EMOJIS[site.kind];
	label += ctx.i18n.t(`static.${site.kind}.title`);
	label += ' ';

	if (site.kind === 'station') {
		const value = `${solarsystem} ${getRomanNumber(site.unique + 1)}`;
		label += includeFormat ? format.underline(value) : value;
	} else if (site.kind === 'stargate') {
		label += includeFormat ? format.underline(site.unique) : site.unique;
	} else {
		let value = site.unique.toString(16);
		while (value.length < 2) {
			value = '0' + value;
		}

		label += includeFormat ? format.monospace(value) : value;
	}

	return label;
}
