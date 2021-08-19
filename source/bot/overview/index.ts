import {MenuTemplate} from 'telegraf-inline-menu';

import {EMOJIS} from '../../html-formatted/emojis.js';
import {setStationInstructions} from '../../game/backend.js';
import {isLocationSite, isLocationStation} from '../../game/typing-checks.js';
import {MyContext} from '../my-context.js';

import {doFacilityButton, getFacilityChoices} from './site/facilities.js';
import {getOwnIdentifier, getOwnLocation} from './general.js';
import {getSlotTargetedChoices, menu as slotTargetedMenu} from './site/slots-targeted.js';
import {getSlotUntargetedChoices, doSlotUntargetedButton} from './site/slots-untargeted.js';
import {menu as selfDestructMenu} from './site/self-destruct.js';
import {menu as warpMenu} from './site/warp.js';
import {menuBody} from './body.js';

export const menu = new MenuTemplate<MyContext>(async ctx => menuBody(ctx, {
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
	hide: async ctx => !(await isInSite(ctx)),
});

menu.submenu(EMOJIS.damage + 'Self Destruct', 'selfDestruct', selfDestructMenu, {
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

async function isInSite(ctx: MyContext) {
	const location = await getOwnLocation(ctx);
	return isLocationSite(location);
}

async function isDocked(ctx: MyContext) {
	const location = await getOwnLocation(ctx);
	return isLocationStation(location);
}
