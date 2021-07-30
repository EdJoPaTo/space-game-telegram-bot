import {MenuTemplate} from 'telegraf-inline-menu';

import {backButtons} from '../general.js';
import {menuBody} from '../body.js';
import {MyContext} from '../../my-context.js';

export const menu = new MenuTemplate<MyContext>(async ctx => menuBody(ctx, {
	menuPosition: ['Self Slots'],
	planned: true,
	shipstats: true,
}));

menu.toggle('Shield Booster', 'sb', {
	isSet: ctx => ctx.session.planned?.some(o => o.includes('Shield Booster')) ?? false,
	set: (ctx, newState) => {
		ctx.session.planned = ctx.session.planned?.filter(o => !o.includes('Shield Booster')) ?? [];
		if (newState) {
			ctx.session.planned.push('-4🔋 +5🛡 Shield Booster');
		}

		return true;
	},
});

menu.manualRow(backButtons);
