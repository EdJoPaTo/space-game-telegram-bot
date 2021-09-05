import {html as format} from 'telegram-format';

import {I18nContextFlavour} from '../bot/my-context.js';
import {Item, ModulePassive, ModuleTargeted, ModuleUntargeted, RoundEffect} from '../game/typings.js';
import {ITEMS, MODULE_PASSIVE, MODULE_TARGETED, MODULE_UNTARGETED} from '../game/statics.js';
import {typedEntities} from '../javascript-helper.js';

import {EMOJIS} from './emojis.js';
import {infoline} from './general.js';

export function itemLabel(ctx: I18nContextFlavour, item: Item) {
	const details = ITEMS[item]!;
	const emoji = EMOJIS[details.category];
	const text = ctx.i18n.t(`item.${item}.title`);
	return emoji + text;
}

export function itemAmountLabel(ctx: I18nContextFlavour, item: Item, amount: number) {
	return `${amount}x ${itemLabel(ctx, item)}`;
}

export interface ItemDescriptionOptions {
	readonly hideInfrastructure?: true;
	readonly hideRecycle?: true;
}

export function itemDescriptionPart(ctx: I18nContextFlavour, item: Item, options: ItemDescriptionOptions = {}) {
	const parts: string[] = [
		ctx.i18n.t(`item.${item}.description`),
	];

	const itemDetails = ITEMS[item]!;
	const recycleItems = typedEntities(itemDetails.recycle);

	const targetedDetails = MODULE_TARGETED[item as ModuleTargeted];
	const untargetedDetails = MODULE_UNTARGETED[item as ModuleUntargeted];
	const passiveDetails = MODULE_PASSIVE[item as ModulePassive];

	const {requiredCpu, requiredPowergrid} = targetedDetails ?? untargetedDetails ?? passiveDetails ?? {};
	if (!options.hideInfrastructure && (requiredCpu || requiredPowergrid)) {
		let text = '';
		text += infoline(EMOJIS.cpu + ctx.i18n.t('ship.requiredCpu'), requiredCpu);
		text += infoline(EMOJIS.powergrid + ctx.i18n.t('ship.requiredPowergrid'), requiredPowergrid);
		parts.push(text);
	}

	if (targetedDetails) {
		const {effectsOrigin, effectsTarget} = targetedDetails;
		let text = '';
		if (effectsOrigin.length > 0) {
			text += format.bold(format.escape(ctx.i18n.t('ship.module.effectsOrigin')));
			text += '\n';
			text += effectsOrigin.map(o => roundEffect(ctx, o)).join('\n');
			text += '\n\n';
		}

		text += format.bold(format.escape(ctx.i18n.t('ship.module.effectsTarget')));
		text += '\n';
		text += effectsTarget.map(o => roundEffect(ctx, o)).join('\n');
		parts.push(text);
	}

	if (untargetedDetails) {
		const {effects} = untargetedDetails;
		let text = '';
		text += format.bold(format.escape(ctx.i18n.t('ship.module.effectsOrigin')));
		text += '\n';
		text += effects.map(o => roundEffect(ctx, o)).join('\n');
		parts.push(text);
	}

	if (passiveDetails) {
		const {hitpointsArmor} = passiveDetails;
		let text = '';
		text += format.bold(format.escape(ctx.i18n.t('ship.module.effectsOrigin')));
		text += '\n';
		if (hitpointsArmor) {
			text += infoline(EMOJIS.armor + 'Armor', hitpointsArmor);
		}

		parts.push(text);
	}

	if (!options.hideRecycle && recycleItems.length > 0) {
		let text = '';
		text += format.bold('Recycle');
		text += '\n';
		text += recycleItems.map(([item, amount]) => itemAmountLabel(ctx, item, amount)).join('\n');
		parts.push(text);
	}

	return parts.map(o => o.trim()).join('\n\n');
}

function roundEffect(_ctx: I18nContextFlavour, effect: RoundEffect): string {
	let line = '';
	line += EMOJIS[effect.type];
	line += effect.type;

	if (effect.amount) {
		line += ': ' + String(effect.amount);
	}

	return line;
}
