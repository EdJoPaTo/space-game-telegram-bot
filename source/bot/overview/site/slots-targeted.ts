import {MenuTemplate} from 'telegraf-inline-menu';

import {addSiteInstructions, getSiteEntities} from '../../../game/backend.js';
import {backButtons, choicesByArrayIndex} from '../../general.js';
import {EMOJIS} from '../../../html-formatted/emojis.js';
import {getOwnIdentifier, getOwnLocation, getOwnShip} from '../general.js';
import {isLocationSite} from '../../../game/typing-checks.js';
import {menuBody} from '../body.js';
import {MODULE_TARGETED} from '../../../game/statics.js';
import {MyContext} from '../../my-context.js';
import {RoundEffect} from '../../../game/typings.js';

async function getModules(ctx: MyContext) {
	const {fitting} = await getOwnShip(ctx);
	return fitting.slotsTargeted;
}

export const menu = new MenuTemplate<MyContext>(async (ctx, path) => {
	const modules = await getModules(ctx);
	const moduleIndex = Number(path.split('slot-targeted:')[1]!.split('/')[0]);
	const moduleKey = modules[moduleIndex]!;
	const module = MODULE_TARGETED[moduleKey]!;
	const moduleName = ctx.i18n.t(`module.${moduleKey}.title`);

	let text = '';
	text += module.effectsOrigin.map(o => roundEffect(ctx, o)).join('\n');
	text += '\n\n';
	text += module.effectsTarget.map(o => roundEffect(ctx, o)).join('\n');

	return menuBody(ctx, {
		entities: true,
		menuPosition: [EMOJIS.target + moduleName],
		shipstats: true,
		text,
	});
});

function roundEffect(_ctx: MyContext, effect: RoundEffect): string {
	let line = '';
	line += EMOJIS[effect.type];
	line += effect.type;

	if (effect.amount) {
		line += ': ' + String(effect.amount);
	}

	return line;
}

async function getTargets(ctx: MyContext) {
	const location = await getOwnLocation(ctx);
	const ownPlayerId = getOwnIdentifier(ctx);
	if (!isLocationSite(location)) {
		throw new Error('not in a site');
	}

	const entities = await getSiteEntities(location.solarsystem, location.site);
	const list = entities
		.map((o, i) => ({entity: o, id: i}))
		.filter(o => o.entity.type !== 'player' || o.entity.id.platform !== ownPlayerId.platform || o.entity.id.id !== ownPlayerId.id);

	const result: Record<number, string> = {};
	for (const item of list) {
		result[item.id] = `${EMOJIS.target}${item.id + 1}`;
	}

	return result;
}

menu.choose('t', getTargets, {
	columns: 4,
	do: async (ctx, key) => {
		if (!('data' in ctx.callbackQuery!)) {
			throw new Error('wat?');
		}

		const path = ctx.callbackQuery.data;
		const moduleIndex = Number(path.split('slot-targeted:')[1]!.split('/')[0]);

		await addSiteInstructions(getOwnIdentifier(ctx), [{
			type: 'moduleTargeted',
			args: {
				moduleIndex,
				targetIndexInSite: Number(key),
			},
		}]);

		await ctx.answerCbQuery('added to planned actions');
		return '..';
	},
});

menu.manualRow(backButtons);

export async function getSlotTargetedChoices(ctx: MyContext) {
	const modules = await getModules(ctx);
	const names = modules.map(m => EMOJIS.target + ctx.i18n.t(`module.${m}.title`));
	return choicesByArrayIndex(names);
}
