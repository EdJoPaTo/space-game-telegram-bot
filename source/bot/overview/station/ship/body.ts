import {html as format} from 'telegram-format';

import {EMOJIS} from '../../../../html-formatted/emojis.js';
import {I18nContextFlavour, MyContext} from '../../../my-context.js';
import {Module} from '../../../../game/typings.js';
import {SHIP_LAYOUTS} from '../../../../game/statics.js';
import {shipStatsPart} from '../../../../html-formatted/ship.js';
import {stationBody} from '../body.js';

export interface Options {
	readonly targeted?: true;
	readonly untargeted?: true;
	readonly passive?: true;

	readonly menuPosition?: readonly string[];
	readonly text?: string;
}

export async function shipBody(ctx: MyContext, options: Options = {}) {
	const ship = await ctx.game.getShip();
	const details = SHIP_LAYOUTS[ship.fitting.layout]!;
	let text = '';

	text += shipStatsPart(ctx, ship);
	text += '\n\n';

	if (options.targeted) {
		const slots = ship.fitting.slotsTargeted;
		text += EMOJIS.module;
		text += EMOJIS.target;
		text += format.bold(format.escape(ctx.i18n.t('ship.targeted')));
		text += ` (${slots.length} / ${details.slotsTargeted})`;
		text += '\n';
		text += moduleList(ctx, slots);
		text += '\n\n';
	}

	if (options.untargeted) {
		const slots = ship.fitting.slotsUntargeted;
		text += EMOJIS.module;
		text += format.bold(format.escape(ctx.i18n.t('ship.untargeted')));
		text += ` (${slots.length} / ${details.slotsUntargeted})`;
		text += '\n';
		text += moduleList(ctx, slots);
		text += '\n\n';
	}

	if (options.passive) {
		const slots = ship.fitting.slotsPassive;
		text += EMOJIS.module;
		text += format.bold(format.escape(ctx.i18n.t('ship.passive')));
		text += ` (${slots.length} / ${details.slotsPassive})`;
		text += '\n';
		text += moduleList(ctx, slots);
		text += '\n\n';
	}

	if (options.text) {
		text += options.text;
	}

	return stationBody(ctx, {
		menuPosition: [ctx.i18n.t('ship.ship'), ...options.menuPosition ?? []],
		text,
	});
}

function moduleList(ctx: I18nContextFlavour, modules: undefined | readonly Module[]) {
	if (modules?.length) {
		return modules.map(o => '- ' + ctx.i18n.t(`item.${o}.title`)).join('\n');
	}

	return 'none';
}
