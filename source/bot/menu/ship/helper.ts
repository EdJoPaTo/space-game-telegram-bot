import {markdown as format} from 'telegram-format';

import {Module, ModuleName, Ship} from '../../../game/types';
import {MyContext} from '../../my-context';
import {ships} from '../../../game/entities';

export function getShip(playerId: number): Ship {
	return ships.get(String(playerId)) ?? {
		playerId: String(playerId),
		lastMovement: 0,
		modules: [],
		coords: {x: 0, y: 0},
		direction: undefined
	};
}

export async function saveShipWithModules(playerId: number, newModules: readonly Module[]): Promise<void> {
	const ship = getShip(playerId);
	const newShip: Ship = {...ship, modules: newModules};
	await ships.set(String(playerId), newShip);
}

export function moduleHeader(context: MyContext, module: ModuleName, amount: number): string {
	let text = '';
	text += format.bold(context.i18n.t('ship.module.' + module + '.title'));
	text += ' (';
	text += amount;
	text += 'x)';
	text += '\n';

	text += context.i18n.t('ship.module.' + module + '.description');
	text += '\n\n';

	return text;
}
