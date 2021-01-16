import {Body, MenuTemplate} from 'telegraf-inline-menu';
import {markdown as format} from 'telegram-format';

import {backButtons} from '../general';
import {ModuleName, MODULES} from '../../../game/types';
import {MyContext} from '../../my-context';

import {getShip, saveShipWithModules} from './helper';
import {menu as genericMenu} from './generic';
import {menu as railgunMenu} from './railgun';

function buttonText(module: ModuleName): (context: MyContext) => string {
	return context => context.i18n.t('ship.module.' + module + '.title');
}

function menuBody(context: MyContext): Body {
	const ship = getShip(context.from!.id);

	let text = format.bold(context.i18n.t('ship.overview'));

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
menu.submenu(buttonText('Railgun'), 'Railgun', railgunMenu, {joinLastRow: true});
menu.submenu(buttonText('MissileBay'), 'MissileBay', genericMenu, {joinLastRow: true});

menu.interact('CHEAT destroy all modules', 'cheat-module-destroy', {
	do: async context => {
		await saveShipWithModules(context.from!.id, []);
		return true;
	}
});

menu.manualRow(backButtons);
