import {MenuTemplate} from 'telegraf-inline-menu';

import {backButtons, choicesByArrayIndex} from '../general.js';
import {menuBody} from '../body.js';
import {MyContext} from '../../my-context.js';
import {getPlayerLocation} from '../../../game/get-whatever.js';

export const menu = new MenuTemplate<MyContext>(async ctx => menuBody(ctx, {
	menuPosition: ['Self Slots'],
	planned: true,
	shipstats: true,
}));

async function getModules() {
	const info = await getPlayerLocation();
	if (!('shipFitting' in info)) {
		throw new Error('not in space');
	}

	return info.shipFitting.slotsSelf;
}

async function getChoices(ctx: MyContext) {
	const modules = await getModules();
	const names = modules.map(m => ctx.i18n.t(`static.${m}.title`));
	return choicesByArrayIndex(names);
}

menu.select('', getChoices, {
	isSet: () => false,
	set: async (ctx, key) => {
		ctx.session.planned ??= [];
		ctx.session.planned.push(`Module Self ${key}`);
		return true;
	},
});

menu.manualRow(backButtons);
