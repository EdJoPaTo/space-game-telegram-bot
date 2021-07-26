import {MenuTemplate} from 'telegraf-inline-menu';

import {MyContext} from '../my-context.js';

import {menuBody} from './body.js';

import {menu as slotsSelfMenu} from './site/slots-self.js';
import {menu as slotsTargetedMenu} from './site/slots-targeted.js';

export const menu = new MenuTemplate<MyContext>(ctx => menuBody(ctx, {
	entities: true,
	planned: true,
	shipstats: true,
	timer: true,
}));

async function answerCbNope(ctx: MyContext) {
	await ctx.answerCbQuery('Not yet implemented in this mockup');
	return false;
}

menu.submenu('High Slots', 'slots-targeted', slotsTargetedMenu);

menu.submenu('Medium Slots', 'slots-self', slotsSelfMenu, {
	joinLastRow: true,
});

menu.interact('Ship Functions', 'ship', {
	do: answerCbNope,
});

menu.interact('Facilities', 'facilities', {
	joinLastRow: true,
	do: answerCbNope,
});

menu.interact('✅Confirm Planned Actions', 'confirm', {
	do: answerCbNope,
});

menu.interact('🛑Cancel Planned', 'cancel', {
	joinLastRow: true,
	hide: ctx => (ctx.session.planned?.length ?? 0) === 0,
	do: ctx => {
		ctx.session.planned = [];
		return true;
	},
});
