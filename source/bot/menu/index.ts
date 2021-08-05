import {MenuTemplate, replyMenuToContext} from 'telegraf-inline-menu';

import {EMOJIS} from '../emojis.js';
import {isLocationStation} from '../../game/typing-checks.js';
import {MyContext} from '../my-context.js';
import {setInstructions} from '../../game/get-whatever.js';
import {sleep} from '../../javascript-helper.js';

import {doFacilityButton, getFacilityChoices} from './site/facilities.js';
import {getOwnIdentifier, getOwnLocation} from './general.js';
import {getSlotTargetedChoices, menu as slotTargetedMenu} from './site/slots-targeted.js';
import {getSlotUntargetedChoices, isSlotUntargetedButtonSet, setSlotUntargetedButton} from './site/slots-untargeted.js';
import {menu as warpMenu} from './site/warp.js';
import {menuBody} from './body.js';

export const menu = new MenuTemplate<MyContext>(async ctx => menuBody(ctx, {
	entities: true,
	planned: true,
	shipstats: true,
}));

menu.chooseIntoSubmenu('slot-targeted', getSlotTargetedChoices, slotTargetedMenu, {
	columns: 2,
	hide: async ctx => !(await canDoSiteActivity(ctx)),
});

menu.select('slot-untargeted', getSlotUntargetedChoices, {
	columns: 2,
	hide: async ctx => !(await canDoSiteActivity(ctx)),
	isSet: isSlotUntargetedButtonSet,
	set: setSlotUntargetedButton,
});

menu.choose('facility', getFacilityChoices, {
	columns: 2,
	hide: async ctx => !(await canDoSiteActivity(ctx)),
	do: doFacilityButton,
});

menu.submenu('Initiate Warp', 'warp', warpMenu, {
	joinLastRow: true,
	hide: async ctx => !(await canDoSiteActivity(ctx)),
});

menu.interact('Undock', 'undock', {
	hide: async ctx => !await isDocked(ctx),
	do: async ctx => {
		ctx.session.planned = [{
			step: 'movement',
			type: 'undock',
		}];
		await ctx.answerCbQuery('added to planned actions');
		return true;
	},
});

menu.interact('✅Confirm Planned Actions', 'confirm', {
	do: async ctx => {
		const identifier = getOwnIdentifier(ctx);
		const instructions = ctx.session.planned ?? [];
		await setInstructions(identifier, instructions);
		ctx.session.planned = [];
		await ctx.editMessageReplyMarkup(undefined);
		await ctx.answerCbQuery('sent… dummy wait 5 seconds for next cycle.');
		await sleep(5000);
		await ctx.reply('some stuff happened… See FAKE log here… Han shot first.');
		await replyMenuToContext(menu, ctx, '/');
		return false;
	},
});

menu.interact(EMOJIS.stop + 'Cancel Planned', 'cancel', {
	joinLastRow: true,
	hide: ctx => (ctx.session.planned?.length ?? 0) === 0,
	do: ctx => {
		ctx.session.planned = [];
		return true;
	},
});

async function canDoSiteActivity(ctx: MyContext) {
	const location = await getOwnLocation(ctx);
	if (!('site' in location)) {
		return false;
	}

	if (ctx.session.planned?.some(o => o.step === 'movement' || o.type === 'facility')) {
		return false;
	}

	return true;
}

async function isDocked(ctx: MyContext) {
	const location = await getOwnLocation(ctx);
	return isLocationStation(location);
}
