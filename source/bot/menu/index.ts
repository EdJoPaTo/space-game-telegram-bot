import {MenuTemplate, replyMenuToContext} from 'telegraf-inline-menu';

import {EMOJIS} from '../emojis.js';
import {isLocationSite, isLocationStation} from '../../game/typing-checks.js';
import {MyContext} from '../my-context.js';
import {setSiteInstructions, setStationInstructions} from '../../game/get-whatever.js';
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

menu.interact(EMOJIS.repair + 'Repair', 'repair', {
	hide: async ctx => !await isDocked(ctx),
	do: async ctx => {
		const identifier = getOwnIdentifier(ctx);
		await setStationInstructions(identifier, ['repair']);
		return true;
	},
});

menu.interact(EMOJIS.undock + 'Undock', 'undock', {
	joinLastRow: true,
	hide: async ctx => !await isDocked(ctx),
	do: async ctx => {
		const identifier = getOwnIdentifier(ctx);
		await setStationInstructions(identifier, ['undock']);
		return true;
	},
});

menu.interact('✅Confirm Planned Actions', 'confirm', {
	hide: async ctx => !(await isInSite(ctx)),
	do: async ctx => {
		const identifier = getOwnIdentifier(ctx);
		await setSiteInstructions(identifier, ctx.session.planned ?? []);
		ctx.session.planned = [];
		await ctx.editMessageReplyMarkup(undefined);
		await ctx.answerCbQuery('sent… now wait 5 secs');
		// TODO: do async / get notified from backend
		await sleep(5000);
		await ctx.reply('some stuff happened… See FAKE log here… Han shot ~first~ at the same time', {parse_mode: 'MarkdownV2'});
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
	if (!isLocationSite(location)) {
		return false;
	}

	if (ctx.session.planned?.some(o => o.type === 'warp' || o.type === 'facility')) {
		return false;
	}

	return true;
}

async function isInSite(ctx: MyContext) {
	const location = await getOwnLocation(ctx);
	return isLocationSite(location);
}

async function isDocked(ctx: MyContext) {
	const location = await getOwnLocation(ctx);
	return isLocationStation(location);
}
