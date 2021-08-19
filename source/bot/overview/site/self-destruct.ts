import {MenuTemplate} from 'telegraf-inline-menu';

import {addSiteInstructions} from '../../../game/backend.js';
import {backButtons} from '../../general.js';
import {EMOJIS} from '../../../html-formatted/emojis.js';
import {getOwnIdentifier} from '../general.js';
import {menuBody} from '../body.js';
import {MyContext} from '../../my-context.js';

export const menu = new MenuTemplate<MyContext>(async ctx => {
	const text = 'Are you sure you want to self destruct?!';

	return menuBody(ctx, {
		menuPosition: [EMOJIS.damage + 'Self Destruct'],
		shipstats: true,
		text,
	});
});

menu.navigate(EMOJIS.stop + 'Abort!', '..');
menu.navigate(EMOJIS.stop + 'Ahh!', '..');
menu.navigate(EMOJIS.stop + 'Stop!', '..');

menu.interact(EMOJIS.damage, 'boom', {
	joinLastRow: true,
	do: async ctx => {
		await addSiteInstructions(getOwnIdentifier(ctx), [{
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
