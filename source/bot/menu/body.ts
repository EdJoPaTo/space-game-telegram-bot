import {html as format} from 'telegram-format';

import {EMOJIS, percentageFraction} from '../emojis.js';
import {getPlayerLocation, getPlayerPretty, getPlayerShip, getSiteEntities, getSites} from '../../game/get-whatever.js';
import {getShipQuickstats} from '../../game/ship-math.js';
import {isLocationSite, isLocationStation} from '../../game/typing-checks.js';
import {MyContext} from '../my-context.js';
import {PlayerIdentifier} from '../../game/typings.js';
import {SHIP_LAYOUTS, SOLARSYSTEMS} from '../../game/get-static.js';

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
	const {fitting: shipFitting, status: shipStatus} = await getPlayerShip(playerId);
	let text = '';

	const solarsystemInfo = SOLARSYSTEMS[location.solarsystem]!;
	text += infoline(EMOJIS.solarsystem + 'Solarsystem', format.underline(location.solarsystem));
	text += infoline(EMOJIS.security + 'Security', `${solarsystemInfo.security}%`);

	if (isLocationStation(location)) {
		// TODO: römisch
		text += infoline(EMOJIS.station + 'Station', `${location.solarsystem} ${location.station + 1}`);
	} else if (isLocationSite(location)) {
		const allSites = await getSites(location.solarsystem);
		const site = Object.values(allSites).flat().find(o => o.siteUnique === location.siteUnique);
		const value = site ? siteLabel(ctx, site, true) : 'Destination unknown';
		text += infoline(EMOJIS.location + 'Site', value);
	} else {
		text += EMOJIS.location + 'In Warp\n';
	}

	text += '\n';

	if (options.shipstats) {
		const shipclass = SHIP_LAYOUTS[shipFitting.layout]!.class;
		text += format.bold(shipFitting.layout);
		text += ' (';
		text += ctx.i18n.t(`static.${shipclass}.title`);
		text += ')';
		text += '\n';
		const ship = getShipQuickstats(shipFitting);
		text += infoline(EMOJIS.hitpointsArmor + 'Armor', quickstatsValue(shipStatus.hitpointsArmor, ship.armor));
		text += infoline(EMOJIS.hitpointsStructure + 'Structure', quickstatsValue(shipStatus.hitpointsStructure, ship.structure));
		text += infoline(EMOJIS.capacitor + 'Capacitor', quickstatsValue(shipStatus.capacitor, ship.capacitor, ship.capacitorRecharge));
		text += '\n';
	}

	if (isLocationSite(location) && options.entities) {
		const entities = await getSiteEntities(location.solarsystem, location.siteUnique);
		const lines = await Promise.all(entities
			.map((o, i) => ({o, i}))
			.filter(({o}) => o.type !== 'player' || o.id !== playerId)
			.map(async ({o, i}) => {
				let type: string;
				let shipclassLabel: string | undefined;
				if ('shiplayout' in o) {
					const shipclass = SHIP_LAYOUTS[o.shiplayout]!.class;
					shipclassLabel = ctx.i18n.t(`static.${shipclass}.title`);
					type = o.shiplayout;
				} else {
					type = ctx.i18n.t(`static.${o.id}.title`);
				}

				let owner: string | undefined;
				if (o.type === 'npc') {
					owner = EMOJIS[o.faction] + ctx.i18n.t(`npcFaction.${o.faction}.title`);
				} else if (o.type === 'player') {
					owner = await getPlayerPretty(o.id as PlayerIdentifier);
				}

				const armor = 'armor' in o ? o.armor : 0;
				const structure = 'structure' in o ? o.structure : 0;

				return entityLine(i + 1, entities.length, type, shipclassLabel, armor, structure, owner);
			}),
		);
		text += lines.join('\n');
		text += '\n\n';
	}

	if (isLocationSite(location) && options.planned) {
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

function entityLine(id: number, total: number, type: string, shipclassLabel: string | undefined, armor: number, structure: number, owner?: string): string {
	let text = '';

	const idText = String(id);
	const idTargetWidth = Math.max(1, Math.floor(Math.log10(total)) + 1);
	const missing = Math.max(0, idTargetWidth - idText.length);
	const idPart = ' '.repeat(missing) + idText;
	text += format.monospace(idPart);
	text += ' ';

	text += format.bold(type);

	if (shipclassLabel) {
		text += ' (';
		text += shipclassLabel;
		text += ')';
	}

	if (armor) {
		text += ' ';
		text += percentageFraction(armor);
		text += EMOJIS.hitpointsArmor;
	}

	if (structure) {
		text += ' ';
		text += percentageFraction(structure);
		text += EMOJIS.hitpointsStructure;
	}

	if (owner) {
		text += ' ' + format.escape(owner);
	}

	return text;
}
