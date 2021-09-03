import {MenuTemplate} from 'telegraf-inline-menu';

import {backButtons} from '../../../general.js';
import {Module} from '../../../../game/typings.js';
import {MyContext} from '../../../my-context.js';

import {shipBody} from './body.js';

function getType(path: string) {
	const type = /\/m(\w)\//.exec(path)?.[1];
	if (type === 't') {
		return 'targeted';
	}

	if (type === 'u') {
		return 'untargeted';
	}

	if (type === 'p') {
		return 'passive';
	}

	throw new Error('unknown module type');
}

export const menu = new MenuTemplate<MyContext>(async (ctx, path) => {
	const type = getType(path);
	return shipBody(ctx, {
		menuPosition: [ctx.i18n.t('ship.' + type)],
		[type]: true,
	});
});

const moduleMenu = new MenuTemplate<MyContext>(async (ctx, path) => {
	const type = getType(path);
	const index = Number(/\/i:(\d+)/.exec(path)![1]);
	const ship = await ctx.game.getShip();
	const slots = type === 'targeted' ? ship.fitting.slotsTargeted : (type === 'untargeted' ? ship.fitting.slotsUntargeted : ship.fitting.slotsPassive);
	const module = slots[index]!;
	const text = ctx.i18n.t(`item.${module}.description`);
	return shipBody(ctx, {
		menuPosition: [ctx.i18n.t('ship.' + type), ctx.i18n.t(`item.${module}.title`)],
		text,
	});
});

async function getModuleChoices(ctx: MyContext) {
	if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
		return {};
	}

	const path = ctx.callbackQuery.data;
	const type = getType(path);
	const ship = await ctx.game.getShip();

	let modules: readonly Module[];
	if (type === 'targeted') {
		modules = ship.fitting.slotsTargeted;
	} else if (type === 'untargeted') {
		modules = ship.fitting.slotsUntargeted;
	} else {
		modules = ship.fitting.slotsPassive;
	}

	const result: Record<string, string> = {};
	for (const [index, module] of Object.entries(modules)) {
		result[index] = ctx.i18n.t(`item.${module}.title`);
	}

	return result;
}

menu.chooseIntoSubmenu('i', getModuleChoices, moduleMenu);
menu.manualRow(backButtons);

moduleMenu.interact(ctx => ctx.i18n.t('ship.removeModule'), 'r', {
	do: async (ctx, path) => {
		const type = getType(path);
		const index = Number(/\/i:(\d+)/.exec(path)![1]);
		await ctx.game.setStationInstructions([{
			type: type === 'targeted' ? 'moduleTargetedRemove' : (type === 'untargeted' ? 'moduleUntargetedRemove' : 'modulePassiveRemove'),
			args: index,
		}]);
		return '..';
	},
});
moduleMenu.manualRow(backButtons);
