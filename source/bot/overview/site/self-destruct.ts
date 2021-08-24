import {MenuTemplate} from 'telegraf-inline-menu';

import {backButtons} from '../../general.js';
import {EMOJIS} from '../../../html-formatted/emojis.js';
import {MyContext} from '../../my-context.js';

import {siteBody} from './body.js';

export const menu = new MenuTemplate<MyContext>(async ctx => {
	const text = 'Are you sure you want to self destruct?!';

	return siteBody(ctx, {
		menuPosition: [EMOJIS.damage + 'Self Destruct'],
		text,
	});
});

menu.navigate(EMOJIS.stop + 'Abort!', '..');
menu.navigate(EMOJIS.stop + 'Ahh!', '..');
menu.navigate(EMOJIS.stop + 'Stop!', '..');

menu.interact(EMOJIS.damage, 'boom', {
	joinLastRow: true,
	do: async ctx => {
		await ctx.game.addSiteInstructions([{
			type: 'selfDestruct',
			args: null,
		}]);
		return '..';
	},
});

menu.navigate(EMOJIS.stop + 'Noo!', '..', {joinLastRow: true});
menu.navigate(EMOJIS.stop + 'Abbruch!', '..');
menu.navigate(EMOJIS.stop + 'Nope!', '..');

menu.manualRow(backButtons);
