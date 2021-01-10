import {Body, MenuTemplate} from 'telegraf-inline-menu';
import {markdown as format} from 'telegram-format';

import {backButtons} from '../general';
import {Module, ModuleName, MODULES} from '../../../game/types';
import {MyContext} from '../../my-context';

import {getShip, saveShipWithModules} from './helper';
import {menu as genericMenu} from './generic';

function buttonText(module: ModuleName): (context: MyContext) => string {
	return context => context.i18n.t('ship.module.' + module + '.title');
}

function menuBody(context: MyContext): Body {
	const ship = getShip(context.from!.id);

	let text = context.i18n.t('ship.overview');

	text += '\n\n';

	for (const module of MODULES) {
		text += format.bold(context.i18n.t('ship.module.' + module + '.title'));
		text += ' (';
		text += ship.modules.filter(o => o.module === module).length;
		text += ')';
		text += '\n';
	}

	return {text, parse_mode: format.parse_mode};
}

export const menu = new MenuTemplate<MyContext>(menuBody);

menu.submenu(buttonText('Engine'), 'Engine', genericMenu);
menu.submenu(buttonText('Storage'), 'Storage', genericMenu);
menu.submenu(buttonText('Miner'), 'Miner', genericMenu);
menu.submenu(buttonText('Printer'), 'Printer', genericMenu);

menu.submenu(buttonText('PointDefenseCannon'), 'PointDefenseCannon', genericMenu);
menu.submenu(buttonText('Railgun'), 'Railgun', genericMenu, {joinLastRow: true});
menu.submenu(buttonText('MissileBay'), 'MissileBay', genericMenu, {joinLastRow: true});

menu.interact('create-storage', 'create-storage', {
	do: async context => {
		const ship = getShip(context.from!.id);

		const newModules: Module[] = [...ship.modules, {
			module: 'Storage',
			storedMass: 0
		}];

		await saveShipWithModules(context.from!.id, newModules);

		return true;
	}
});

menu.manualRow(backButtons);
