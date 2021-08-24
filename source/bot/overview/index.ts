import {MenuTemplate} from 'telegraf-inline-menu';

import {addOpenOverviews} from '../../persist-data/overviews.js';
import {EMOJIS} from '../../html-formatted/emojis.js';
import {isLocationSite, isLocationStation} from '../../game/typing-checks.js';
import {MyContext} from '../my-context.js';

import {doFacilityButton, getFacilityChoices} from './site/facilities.js';
import {doSlotUntargetedButton, getSlotUntargetedChoices} from './site/slots-untargeted.js';
import {menu as selfDestructMenu} from './site/self-destruct.js';
import {menu as slotTargetedMenu, getSlotTargetedChoices} from './site/slots-targeted.js';
import {menu as warpMenu} from './site/warp.js';
import {siteBody} from './site/body.js';
import {stationBody} from './station/body.js';

export const menu = new MenuTemplate<MyContext>(async ctx => {
	const message_id = ctx.callbackQuery?.message?.message_id;
	if (ctx.from?.id && message_id) {
		await addOpenOverviews(ctx.from.id, message_id);
	}

	if (isLocationSite(ctx.game.location)) {
		return siteBody(ctx, {
			planned: true,
		});
	}

	if (isLocationStation(ctx.game.location)) {
		return stationBody(ctx);
	}

	return 'You are in warp. It will take a moment to land at the destination.';
});

menu.chooseIntoSubmenu('slot-targeted', getSlotTargetedChoices, slotTargetedMenu, {
	columns: 2,
	hide: hideSite,
});

menu.choose('slot-untargeted', getSlotUntargetedChoices, {
	columns: 2,
	hide: hideSite,
	do: doSlotUntargetedButton,
});

menu.choose('facility', getFacilityChoices, {
	columns: 2,
	hide: hideSite,
	do: doFacilityButton,
});

menu.submenu('Initiate Warp', 'warp', warpMenu, {
	hide: hideSite,
});

menu.submenu(EMOJIS.damage + 'Self Destruct', 'selfDestruct', selfDestructMenu, {
	hide: hideSite,
});

menu.interact(EMOJIS.asteroidField + 'Sell Ore', 'ore', {
	hide: hideStation,
	do: async ctx => {
		await ctx.game.setStationInstructions(['sellOre']);
		return true;
	},
});

menu.interact(EMOJIS.repair + 'Repair', 'repair', {
	hide: hideStation,
	do: async ctx => {
		await ctx.game.setStationInstructions(['repair']);
		return true;
	},
});

menu.interact(EMOJIS.undock + 'Undock', 'undock', {
	joinLastRow: true,
	hide: hideStation,
	do: async ctx => {
		await ctx.game.setStationInstructions(['undock']);
		return true;
	},
});

function hideSite(ctx: MyContext) {
	return !isLocationSite(ctx.game.location);
}

function hideStation(ctx: MyContext) {
	return !isLocationStation(ctx.game.location);
}
