import {MenuTemplate} from 'telegraf-inline-menu';

import {backButtons} from '../../../general.js';
import {itemDescriptionPart} from '../../../../html-formatted/item.js';
import {ITEMS} from '../../../../game/statics.js';
import {Module} from '../../../../game/typings.js';
import {MyContext} from '../../../my-context.js';
import {typedKeys} from '../../../../javascript-helper.js';

import {shipBody} from './body.js';

function getModule(path: string) {
	return /\/i:([^/]+)/.exec(path)![1] as Module;
}

export const menu = new MenuTemplate<MyContext>(async ctx => shipBody(ctx, {
	menuPosition: [ctx.i18n.t('ship.equipModule')],
	passive: true,
	untargeted: true,
	targeted: true,
	text: ctx.i18n.t('ship.equipModuleHelp'),
}));

const moduleMenu = new MenuTemplate<MyContext>(async (ctx, path) => {
	const module = getModule(path);
	return shipBody(ctx, {
		menuPosition: [ctx.i18n.t('ship.equipModule'), ctx.i18n.t(`item.${module}.title`)],
		text: itemDescriptionPart(ctx, module, {
			hideRecycle: true,
		}),
	});
});

async function getModuleChoices(ctx: MyContext) {
	const assets = await ctx.game.getStationAssets();
	const items = typedKeys(assets.storage);
	const modules = items.filter(o => ITEMS[o]!.category === 'module');

	const result: Record<string, string> = {};
	for (const m of modules) {
		result[m] = ctx.i18n.t(`item.${m}.title`);
	}

	return result;
}

menu.chooseIntoSubmenu('i', getModuleChoices, moduleMenu, {
	columns: 2,
	getCurrentPage: ctx => ctx.session.page,
	setPage: (ctx, page) => {
		ctx.session.page = page;
	},
});

menu.manualRow(backButtons);

moduleMenu.interact(ctx => ctx.i18n.t('ship.equipModule'), 'e', {
	do: async (ctx, path) => {
		const module = getModule(path);
		try {
			await ctx.game.setStationInstructions([{
				type: 'moduleAdd',
				args: module,
			}]);
			return '..';
		} catch {
			await ctx.reply(ctx.i18n.t('ship.equipModuleFailed'));
			return true;
		}
	},
});
moduleMenu.manualRow(backButtons);
