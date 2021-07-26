import {MenuTemplate} from 'telegraf-inline-menu';

import {backButtons} from '../general.js';
import {menuBody} from '../body.js';
import {MyContext} from '../../my-context.js';

export const moduleMenu = new MenuTemplate<MyContext>((ctx, path) => {
	const module = path.split('m:')[1]!.split('/')[0]!;

	return menuBody(ctx, {
		entities: true,
		menuPosition: ['High Slots', module],
		planned: true,
		shipstats: true,
	});
});

const targets = {
	1: '1. Frigate 🏴‍☠️Pirate',
	2: '2. Asteroid',
	3: '3. Asteroid',
	4: '4. Asteroid',
};

moduleMenu.choose('t', targets, {
	columns: 1,
	do: async (ctx, key) => {
		if (!('data' in ctx.callbackQuery!)) {
			throw new Error('wat?');
		}

		const path = 		ctx.callbackQuery.data;
		const module = path.split('m:')[1]!.split('/')[0]!;

		ctx.session.planned = ctx.session.planned?.filter(o => !o.includes(module)) ?? [];
		ctx.session.planned.push(`-6🔋 ${module} -> ${key}`);

		await ctx.answerCbQuery('added to planned actions');

		return '..';
	},
});

moduleMenu.manualRow(backButtons);

export const menu = new MenuTemplate<MyContext>(ctx => menuBody(ctx, {
	entities: true,
	menuPosition: ['High Slots'],
	planned: true,
	shipstats: true,
}));

menu.chooseIntoSubmenu('m', ['Mining Laser', 'Small Laser'], moduleMenu);

menu.manualRow(backButtons);
