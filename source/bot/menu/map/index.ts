import {Body, MenuTemplate} from 'telegraf-inline-menu';
import {markdown as format} from 'telegram-format';

import {backButtons} from '../general';
import {MyContext} from '../../my-context';

function menuBody(context: MyContext): Body {
	let text = format.bold(context.i18n.t('map.overview'));

	text += '\n\n';
	text += format.italic('nothing to see here yet…');

	return {text, parse_mode: format.parse_mode};
}

export const menu = new MenuTemplate<MyContext>(menuBody);

menu.manualRow(backButtons);
