import {MenuTemplate} from 'telegraf-inline-menu';

import {getSiteInternals} from '../../game/get-whatever.js';
import {MyContext} from '../my-context.js';

import {getOwnLocation} from './general.js';
import {menu as facilityMenu} from './site/facilities.js';
import {menu as slotsSelfMenu} from './site/slots-self.js';
import {menu as slotsTargetedMenu} from './site/slots-targeted.js';
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

menu.submenu('Targeted Slots', 'slots-targeted', slotsTargetedMenu, {
	hide: async ctx => !(await canDoSomething(ctx)),
});

menu.submenu('Self Slots', 'slots-self', slotsSelfMenu, {
	joinLastRow: true,
	hide: async ctx => !(await canDoSomething(ctx)),
});

menu.submenu('Facilities', 'facilities', facilityMenu, {
	hide: async ctx => !(await canUseFacilities(ctx)),
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

async function canUseFacilities(ctx: MyContext) {
	const location = await getOwnLocation(ctx);
	if (!('site' in location)) {
		return false;
	}

	if (ctx.session.planned?.some(o => o.type === 'facility' || o.type === 'warp')) {
		return false;
	}

	const site = await getSiteInternals(location.solarsystem, location.site.unique);
	return site.entities.some(o => o.type === 'facility');
}

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
