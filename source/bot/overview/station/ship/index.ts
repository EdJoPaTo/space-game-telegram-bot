import {MenuTemplate} from 'telegraf-inline-menu';

import {backButtons} from '../../../general.js';
import {EMOJIS} from '../../../../html-formatted/emojis.js';
import {MyContext} from '../../../my-context.js';

import {menu as equipModuleMenu} from './equip-module.js';
import {menu as existingModulesMenu} from './existing-modules.js';
import {shipBody} from './body.js';

export const menu = new MenuTemplate<MyContext>(async ctx => shipBody(ctx, {
	targeted: true,
	untargeted: true,
	passive: true,
}));

menu.interact(ctx => EMOJIS.repair + ctx.i18n.t('ship.repair'), 'repair', {
	do: async ctx => {
		await ctx.game.setStationInstructions([{
			type: 'repair',
		}]);
		return true;
	},
});

menu.submenu(ctx => EMOJIS.module + ctx.i18n.t('ship.targeted'), 'mt', existingModulesMenu);
menu.submenu(ctx => EMOJIS.module + ctx.i18n.t('ship.untargeted'), 'mu', existingModulesMenu);
menu.submenu(ctx => EMOJIS.module + ctx.i18n.t('ship.passive'), 'mp', existingModulesMenu);
menu.submenu(ctx => EMOJIS.add + EMOJIS.module + ctx.i18n.t('ship.equipModule'), 'e', equipModuleMenu);
menu.manualRow(backButtons);
