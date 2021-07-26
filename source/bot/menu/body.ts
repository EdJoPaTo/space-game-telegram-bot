import {html as format} from 'telegram-format';

import {MyContext} from '../my-context.js';

export interface Options {
	readonly timer?: true;
	readonly shipstats?: true;
	readonly entities?: true;
	readonly planned?: true;

	readonly menuPosition?: readonly string[];

	readonly text?: string;
}

export function menuBody(context: MyContext, options: Options = {}) {
	let text = '';
	text += format.italic('🪐Solarsystem');
	text += ': ';
	text += 'Karvis';
	text += ' ';
	text += format.italic('0.92');
	text += '\n';

	text += infoline('📍Site', 'K3 Asteroid Belt III');
	if (options.timer) {
		text += infoline('⏱Round Time', '30s');
	}

	text += '\n';

	if (options.shipstats) {
		text += infoline('🛡Armor', '75% 60/80');
		text += infoline('🚀Hull', '100% 20/20');
		text += infoline('🔋Energy', '50% 20/40 (+10/r)');
		text += '\n';
	}

	if (options.entities) {
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

function entityLine(id: string, type: string, owner?: string): string {
	let text = format.monospace(id) + ' ' + format.bold(type);
	if (owner) {
		text += ' ' + format.escape(owner);
	}

	text += '\n';
	return text;
}
