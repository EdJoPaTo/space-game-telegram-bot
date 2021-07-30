import {MenuTemplate} from 'telegraf-inline-menu';

import {backButtons, choicesByArrayIndex} from '../general.js';
import {menuBody} from '../body.js';
import {MyContext} from '../../my-context.js';

import {getPlayerInSpace} from './helper.js';

export const menu = new MenuTemplate<MyContext>(async ctx => menuBody(ctx, {
	menuPosition: ['Self Slots'],
	planned: true,
	shipstats: true,
}));

async function getModules(ctx: MyContext) {
	const info = await getPlayerInSpace(ctx);
	return info.shipFitting.slotsSelf;
}

async function getChoices(ctx: MyContext) {
	const modules = await getModules(ctx);
	const names = modules.map(m => ctx.i18n.t(`static.${m}.title`));
	return choicesByArrayIndex(names);
}

menu.choose('', getChoices, {
	do: async (ctx, key) => {
		const moduleId = Number(key);
		ctx.session.planned = ctx.session.planned?.filter(o => o.type !== 'module-targeted' || o.moduleId !== moduleId) ?? [];
		ctx.session.planned.push({
			type: 'module-self',
			moduleId,
		});
		return true;
	},
});

menu.manualRow(backButtons);
