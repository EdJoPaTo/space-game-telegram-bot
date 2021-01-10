import {Body, MenuTemplate} from 'telegraf-inline-menu';
import {markdown as format} from 'telegram-format';

import {backButtons} from '../general';
import {ModuleName} from '../../../game/types';
import {MyContext} from '../../my-context';

import {getShip, moduleHeader} from './helper';

function menuBody(context: MyContext, path: string): Body {
	const module = path.split('/')[2]! as ModuleName;
	const ship = getShip(context.from!.id);
	const all = ship.modules.filter(o => o.module === module);

	let text = '';
	text += moduleHeader(context, module, all.length);
	text += format.bold(context.i18n.t('ship.module.' + module + '.title'));
	text += ' (';
	text += all.length;
	text += ')';
	text += '\n\n';

	text += context.i18n.t('ship.module.' + module + '.description');

	return {text, parse_mode: format.parse_mode};
}

export const menu = new MenuTemplate<MyContext>(menuBody);

menu.manualRow(backButtons);
