import {MenuTemplate} from 'telegraf-inline-menu';

import {MyContext} from '../my-context.js';

import {doFacilityButton, getFacilityChoices} from './site/facilities.js';
import {doSlotSelfButton, getSlotSelfChoices} from './site/slots-self.js';
import {getOwnLocation} from './general.js';
import {getSlotTargetedChoices, menu as slotTargetedMenu} from './site/slots-targeted.js';
import {menu as warpMenu} from './site/warp.js';
import {menuBody} from './body.js';

export const menu = new MenuTemplate<MyContext>(async ctx => menuBody(ctx, {
	entities: true,
	planned: true,
	shipstats: true,
}));

async function answerCbNope(ctx: MyContext) {
	await ctx.answerCbQuery('Not yet implemented in this mockup');
	return false;
}

menu.chooseIntoSubmenu('slot-targeted', getSlotTargetedChoices, slotTargetedMenu, {
	columns: 2,
	hide: async ctx => !(await canDoSomething(ctx)),
});

menu.choose('slot-self', getSlotSelfChoices, {
	columns: 2,
	hide: async ctx => !(await canDoSomething(ctx)),
	do: doSlotSelfButton,
});

menu.choose('facility', getFacilityChoices, {
	columns: 2,
	hide: async ctx => !(await canDoSomething(ctx)),
	do: doFacilityButton,
});

menu.submenu('Initiate Warp', 'warp', warpMenu, {
	joinLastRow: true,
	hide: async ctx => !(await canDoSomething(ctx)),
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

async function canDoSomething(ctx: MyContext) {
	const location = await getOwnLocation(ctx);
	if (!('site' in location)) {
		return false;
	}

	if (ctx.session.planned?.some(o => o.type === 'facility' || o.type === 'warp')) {
		return false;
	}

	return true;
}
