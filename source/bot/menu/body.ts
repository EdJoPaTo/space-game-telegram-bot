import {html as format} from 'telegram-format';

import {EMOJIS} from '../emojis.js';
import {getPlayerLocation, getPlayerPretty, getSiteEntities} from '../../game/get-whatever.js';
import {getShipQuickstats} from '../../game/ship-math.js';
import {MyContext} from '../my-context.js';
import {SOLARSYSTEMS} from '../../game/get-static.js';

import {getOwnIdentifier, siteLabel} from './general.js';

export interface Options {
	readonly shipstats?: true;
	readonly entities?: true;
	readonly planned?: true;

	readonly menuPosition?: readonly string[];

	readonly text?: string;
}

export async function menuBody(ctx: MyContext, options: Options = {}) {
	const playerId = getOwnIdentifier(ctx);
	const location = await getPlayerLocation(playerId);
	let text = '';

	const solarsystemInfo = SOLARSYSTEMS[location.solarsystem]!;
	text += infoline(EMOJIS.solarsystem + 'Solarsystem', format.underline(location.solarsystem));
	text += infoline(EMOJIS.security + 'Security', solarsystemInfo.security + '%');

	if ('station' in location) {
		// TODO: römisch
		text += infoline(EMOJIS.facilityStation + 'Station', `${location.solarsystem} ${location.station}`);
	} else if ('site' in location) {
		text += infoline(EMOJIS.location + 'Site', siteLabel(ctx, location.site, true));
	} else {
		text += EMOJIS.location + 'In warp…\n';
	}

	text += '\n';

	if ('shipStatus' in location) {
		const {shipFitting, shipStatus} = location;
		if (options.shipstats) {
			text += format.bold(ctx.i18n.t(`static.${shipFitting.layout}.title`));
			text += '\n';
			const ship = getShipQuickstats(shipFitting);
			text += infoline(EMOJIS.hitpointsArmor + 'Armor', quickstatsValue(shipStatus.hitpointsArmor, ship.armor));
			text += infoline(EMOJIS.hitpointsStructure + 'Structure', quickstatsValue(shipStatus.hitpointsStructure, ship.structure));
			text += infoline(EMOJIS.capacitor + 'Capacitor', quickstatsValue(shipStatus.capacitor, ship.capacitor, ship.capacitorRecharge));
			text += '\n';
		}
	}

	if ('site' in location && options.entities) {
		const entities = await getSiteEntities(location.solarsystem, location.site.unique);
		const lines = await Promise.all(entities
			.map((o, i) => ({o, i}))
			.filter(({o}) => o.type !== 'player' || o.id !== playerId)
			.map(async ({o, i}) => {
				const type = ctx.i18n.t(`static.${'shiplayout' in o ? o.shiplayout : o.id}.title`);

				let owner: string | undefined;
				if (o.type === 'npc') {
					owner = '🏴‍☠️Pirate';
				} else if (o.type === 'player') {
					const pretty = await getPlayerPretty(o.id);
					owner = pretty.name;
				}

				return entityLine(i + 1, entities.length, type, owner);
			}),
		);
		text += lines.join('\n');
		text += '\n\n';
	}

	if (options.planned) {
		text += '📝planned actions:\n';
		text += ctx.session.planned?.length ? ctx.session.planned.map(o => format.monospace(JSON.stringify(o))).join('\n') : 'none';
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

function entityLine(id: number, total: number, type: string, owner?: string): string {
	let text = '';

	const idText = String(id);
	const idTargetWidth = Math.max(1, Math.floor(Math.log10(total)) + 1);
	const missing = Math.max(0, idTargetWidth - idText.length);
	const idPart = ' '.repeat(missing) + idText;
	text += format.monospace(idPart);
	text += ' ';

	text += format.bold(type);

	if (owner) {
		text += ' ' + format.escape(owner);
	}

	return text;
}
