import {html as format} from 'telegram-format';

import {getShipQuickstats} from '../game/ship-math.js';
import {I18nContextFlavour} from '../bot/my-context.js';
import {Ship} from '../game/typings.js';
import {SHIP_LAYOUTS} from '../game/statics.js';

import {EMOJIS} from './emojis.js';
import {infoline} from './general.js';

export function shipStatsPart(ctx: I18nContextFlavour, ship: Ship) {
	const {fitting, collateral, cargo} = ship;
	let text = '';

	const layout = SHIP_LAYOUTS[fitting.layout]!;
	const shipclass = layout.class;
	text += format.bold(fitting.layout);
	text += ' (';
	text += ctx.i18n.t(`static.${shipclass}.title`);
	text += ')';
	text += '\n';
	const max = getShipQuickstats(fitting);
	text += infoline(EMOJIS.armor + 'Armor', quickstatsValue(collateral.armor, max.armor));
	text += infoline(EMOJIS.structure + 'Structure', quickstatsValue(collateral.structure, max.structure));
	text += infoline(EMOJIS.capacitor + 'Capacitor', quickstatsValue(collateral.capacitor, max.capacitor, max.capacitorRecharge));
	text += infoline(EMOJIS.asteroidField + 'Ore', quickstatsValue(cargo.ore, layout.oreBay));
	text += '\n';

	return text;
}

function quickstatsValue(current = 0, max = 0, recharge = 0) {
	const percentage = current / max;
	const percentageHuman = (percentage * 100).toFixed(1) + '%';
	let text = '';
	text += percentageHuman;
	text += ' ';
	text += current.toFixed(0);
	text += '/';
	text += max.toFixed(0);

	if (recharge) {
		text += ' (+';
		text += recharge.toFixed(0);
		text += '/r)';
	}

	return text;
}
