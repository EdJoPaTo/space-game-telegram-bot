import {html as format} from 'telegram-format';

import {getPlayerlocation} from '../../game/get-playerstate.js';
import {getShipQuickstats} from '../../game/ship-math.js';
import {MyContext} from '../my-context.js';
import {SOLARSYSTEMS} from '../../game/types/static/solarsystems.js';

export interface Options {
	readonly shipstats?: true;
	readonly entities?: true;
	readonly planned?: true;

	readonly menuPosition?: readonly string[];

	readonly text?: string;
}

export async function menuBody(context: MyContext, options: Options = {}) {
	const player = await getPlayerlocation();
	let text = '';

	const solarsystem = SOLARSYSTEMS[player.solarsystem]!;
	text += format.italic('🪐Solarsystem');
	text += ': ';
	text += solarsystem.name;
	text += ' ';
	text += format.italic(solarsystem.security.toFixed(2));
	text += '\n';

	if ('station' in player) {
		text += infoline('📍Station', player.station.toString());
	} else {
		const {site} = player;
		text += site ? infoline('📍Site', 'K3 Asteroid Belt III') : '📍In warp…\n';
	}

	text += '\n';

	if ('shipStatus' in player) {
		const {shipFitting, shipStatus} = player;
		if (options.shipstats) {
			const ship = getShipQuickstats(shipFitting);
			text += infoline('🛡Armor', quickstatsValue(shipStatus.armor, ship.armor));
			text += infoline('🚀Structure', quickstatsValue(shipStatus.structure, ship.structure));
			text += infoline('🔋Energy', quickstatsValue(shipStatus.capacitor, ship.capacitor, ship.capacitorRecharge));
			text += '\n';
		}
	}

	if ('site' in player && options.entities) {
		text += entityLine('->', 'Rookie Ship', '🦔' + context.from!.first_name);
		text += entityLine(' 1', 'Frigate', '🏴‍☠️Pirate');
		text += entityLine(' 2', 'Asteroid');
		text += entityLine(' 3', 'Asteroid');
		text += entityLine(' 4', 'Asteroid');
		text += '\n';
	}

	if (options.planned) {
		text += '📝planned actions:\n';
		text += context.session.planned?.length ? context.session.planned.join('\n') : 'none';
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

function entityLine(id: string, type: string, owner?: string): string {
	let text = format.monospace(id) + ' ' + format.bold(type);
	if (owner) {
		text += ' ' + format.escape(owner);
	}

	text += '\n';
	return text;
}
