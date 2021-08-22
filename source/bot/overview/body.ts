import {html as format} from 'telegram-format';

import {addOpenOverviews} from '../../persist-data/overviews.js';
import {EMOJIS} from '../../html-formatted/emojis.js';
import {getPlayerGenerals, getPlayerLocation, getPlayerShip, getSiteInstructions} from '../../game/backend.js';
import {getShipQuickstats} from '../../game/ship-math.js';
import {isLocationSite, isLocationStation} from '../../game/typing-checks.js';
import {MyContext} from '../my-context.js';
import {SHIP_LAYOUTS} from '../../game/statics.js';

import {getOwnIdentifier} from './general.js';

export interface Options {
	readonly shipstats?: true;
	readonly planned?: true;

	readonly menuPosition?: readonly string[];

	readonly text?: string;
}

export async function menuBody(ctx: MyContext, options: Options = {}) {
	const message_id = ctx.callbackQuery?.message?.message_id;
	if (ctx.from?.id && message_id) {
		await addOpenOverviews(ctx.from.id, message_id);
	}

	const ownPlayerId = getOwnIdentifier(ctx);
	const location = await getPlayerLocation(ownPlayerId);
	const {fitting, status: shipStatus, cargo} = await getPlayerShip(ownPlayerId);
	let text = '';

	if (options.shipstats) {
		const layout = SHIP_LAYOUTS[fitting.layout]!;
		const shipclass = layout.class;
		text += format.bold(fitting.layout);
		text += ' (';
		text += ctx.i18n.t(`static.${shipclass}.title`);
		text += ')';
		text += '\n';
		const ship = getShipQuickstats(fitting);
		text += infoline(EMOJIS.hitpointsArmor + 'Armor', quickstatsValue(shipStatus.hitpointsArmor, ship.armor));
		text += infoline(EMOJIS.hitpointsStructure + 'Structure', quickstatsValue(shipStatus.hitpointsStructure, ship.structure));
		text += infoline(EMOJIS.capacitor + 'Capacitor', quickstatsValue(shipStatus.capacitor, ship.capacitor, ship.capacitorRecharge));
		text += infoline(EMOJIS.asteroidField + 'Ore', quickstatsValue(cargo.ore, layout.oreBay));
		text += '\n';
	}

	if (isLocationStation(location)) {
		const generals = await getPlayerGenerals(ownPlayerId);
		text += infoline(EMOJIS.paperclip + 'Paperclips', generals.paperclips.toFixed(0));
	}

	if (isLocationSite(location) && options.planned) {
		const planned = await getSiteInstructions(ownPlayerId);
		text += '📝planned actions:\n';
		text += planned.length > 0 ? planned.map(o => format.monospace(JSON.stringify(o))).join('\n') : 'none';
		text += '\n\n';
	}

	if (options.menuPosition?.length) {
		const lines = options.menuPosition.map((o, i) => '  '.repeat(i) + format.bold(o));
		text += lines.join('\n');
		text += '\n\n';
	}

	if (options.text) {
		text += options.text;
	}

	return {text, parse_mode: format.parse_mode};
}

function infoline(title: string, value: string): string {
	return format.italic(title) + ': ' + value + '\n';
}

function quickstatsValue(current: number, max: number, recharge?: number) {
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
