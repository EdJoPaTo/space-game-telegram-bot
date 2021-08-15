import {MenuTemplate, replyMenuToContext} from 'telegraf-inline-menu';

import {EMOJIS} from '../emojis.js';
import {FAKE_SITE_LOG, setStationInstructions} from '../../game/get-whatever.js';
import {isLocationSite, isLocationStation} from '../../game/typing-checks.js';
import {MyContext} from '../my-context.js';

import {doFacilityButton, getFacilityChoices} from './site/facilities.js';
import {generateHtmlLog} from './html-formatted/site-log.js';
import {getOwnIdentifier, getOwnLocation} from './general.js';
import {getSlotTargetedChoices, menu as slotTargetedMenu} from './site/slots-targeted.js';
import {getSlotUntargetedChoices, doSlotUntargetedButton} from './site/slots-untargeted.js';
import {menu as warpMenu} from './site/warp.js';
import {menuBody} from './body.js';

export const menu = new MenuTemplate<MyContext>(async ctx => menuBody(ctx, {
	entities: true,
	planned: true,
	shipstats: true,
}));

menu.chooseIntoSubmenu('slot-targeted', getSlotTargetedChoices, slotTargetedMenu, {
	columns: 2,
	hide: async ctx => !(await isInSite(ctx)),
});

menu.choose('slot-untargeted', getSlotUntargetedChoices, {
	columns: 2,
	hide: async ctx => !(await isInSite(ctx)),
	do: doSlotUntargetedButton,
});

menu.choose('facility', getFacilityChoices, {
	columns: 2,
	hide: async ctx => !(await isInSite(ctx)),
	do: doFacilityButton,
});

menu.submenu('Initiate Warp', 'warp', warpMenu, {
	joinLastRow: true,
	hide: async ctx => !(await isInSite(ctx)),
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

// TODO: do async / get notified from backend
menu.interact('Bodge: Fake Round', 'update', {
	hide: async ctx => isDocked(ctx),
	do: async ctx => {
		await ctx.editMessageReplyMarkup(undefined);

		const fakeLog = await generateHtmlLog(ctx, FAKE_SITE_LOG);
		await ctx.reply('some stuff happened… See FAKE log here…\n\n' + fakeLog, {parse_mode: 'HTML'});

		await replyMenuToContext(menu, ctx, '/');
		return false;
	},
});

async function isInSite(ctx: MyContext) {
	const location = await getOwnLocation(ctx);
	return isLocationSite(location);
}

async function isDocked(ctx: MyContext) {
	const location = await getOwnLocation(ctx);
	return isLocationStation(location);
}
