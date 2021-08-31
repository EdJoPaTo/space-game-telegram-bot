import {MenuTemplate} from 'telegraf-inline-menu';

import {addOpenOverviews} from '../../persist-data/overviews.js';
import {EMOJIS} from '../../html-formatted/emojis.js';
import {isPlayerLocationSite, isPlayerLocationStation} from '../../game/typings.js';
import {MyContext} from '../my-context.js';

import {doFacilityButton, getFacilityChoices} from './site/facilities.js';
import {doSlotUntargetedButton, getSlotUntargetedChoices} from './site/slots-untargeted.js';
import {menu as itemMenu} from './station/items.js';
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

	if (isPlayerLocationSite(ctx.game.location)) {
		return siteBody(ctx, {
			planned: true,
		});
	}

	if (isPlayerLocationStation(ctx.game.location)) {
		return stationBody(ctx);
	}

	return ctx.i18n.t('warp.warping');
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

menu.submenu(ctx => EMOJIS.warp + ctx.i18n.t('warp.initiate'), 'warp', warpMenu, {
	hide: hideSite,
});

menu.submenu(EMOJIS.damage + 'Self Destruct', 'selfDestruct', selfDestructMenu, {
	hide: hideSite,
});

menu.interact(EMOJIS.repair + 'Repair', 'repair', {
	hide: hideStation,
	do: async ctx => {
		await ctx.game.setStationInstructions([{
			type: 'repair',
		}]);
		return true;
	},
});

menu.submenu(EMOJIS.storage + 'Items', 'items', itemMenu, {
	hide: hideStation,
});

menu.interact(EMOJIS.undock + 'Undock', 'undock', {
	hide: hideStation,
	do: async ctx => {
		await ctx.game.setStationInstructions([{
			type: 'undock',
		}]);
		return true;
	},
});

function hideSite(ctx: MyContext) {
	return !isPlayerLocationSite(ctx.game.location);
}

function hideStation(ctx: MyContext) {
	return !isPlayerLocationStation(ctx.game.location);
}
