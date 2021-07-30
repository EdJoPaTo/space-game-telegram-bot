import {MenuTemplate} from 'telegraf-inline-menu';

import {backButtons, choicesByArrayIndex} from '../general.js';
import {getSite} from '../../../game/get-whatever.js';
import {menuBody} from '../body.js';
import {MODULE_TARGETED} from '../../../game/types/static/modules.js';
import {MyContext} from '../../my-context.js';

import {getPlayerInSite} from './helper.js';

async function getModules(ctx: MyContext) {
	const info = await getPlayerInSite(ctx);
	return info.shipFitting.slotsTargeted;
}

export const moduleMenu = new MenuTemplate<MyContext>(async (ctx, path) => {
	const modules = await getModules(ctx);
	const index = Number(path.split('m:')[1]!.split('/')[0]);
	const moduleKey = modules[index]!;
	const module = MODULE_TARGETED[moduleKey]!;
	const moduleName = ctx.i18n.t(`static.${moduleKey}.title`);

	let text = '';
	text += `-${module.energyConsumption}🔋\n`;

	return menuBody(ctx, {
		entities: true,
		menuPosition: ['Targeted Slots', moduleName],
		planned: true,
		shipstats: true,
		text,
	});
});

async function getTargets() {
	const {entities} = await getSite('system666-666-bla');
	const list = entities
		.map((o, i) => ({entity: o, id: i}))
		.filter(o => o.entity.type !== 'player');

	const result: Record<number, string> = {};
	for (const item of list) {
		result[item.id] = `${item.id + 1}`;
	}

	return result;
}

moduleMenu.choose('t', getTargets, {
	columns: 4,
	do: async (ctx, key) => {
		if (!('data' in ctx.callbackQuery!)) {
			throw new Error('wat?');
		}

		const path = ctx.callbackQuery.data;
		const moduleId = Number(path.split('m:')[1]!.split('/')[0]);

		ctx.session.planned = ctx.session.planned?.filter(o => o.type !== 'module-targeted' || o.moduleId !== moduleId) ?? [];
		ctx.session.planned.push({
			type: 'module-targeted',
			moduleId,
			targetIdInSite: Number(key),
		});

		await ctx.answerCbQuery('added to planned actions');

		return '..';
	},
});

moduleMenu.manualRow(backButtons);

export const menu = new MenuTemplate<MyContext>(async ctx => menuBody(ctx, {
	entities: true,
	menuPosition: ['Targeted Slots'],
	planned: true,
	shipstats: true,
}));

async function getModuleChoices(ctx: MyContext) {
	const modules = await getModules(ctx);
	const names = modules.map(m => ctx.i18n.t(`static.${m}.title`));
	return choicesByArrayIndex(names);
}

menu.chooseIntoSubmenu('m', getModuleChoices, moduleMenu);

menu.manualRow(backButtons);
