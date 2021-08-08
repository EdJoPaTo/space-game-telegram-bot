import {MenuTemplate} from 'telegraf-inline-menu';

import {backButtons, choicesByArrayIndex, getOwnIdentifier, getOwnLocation, getOwnShip} from '../general.js';
import {EMOJIS} from '../../emojis.js';
import {getSiteEntities} from '../../../game/get-whatever.js';
import {isLocationSite} from '../../../game/typing-checks.js';
import {menuBody} from '../body.js';
import {MODULE_TARGETED} from '../../../game/get-static.js';
import {ModuleEffect} from '../../../game/typings.js';
import {MyContext} from '../../my-context.js';

async function getModules(ctx: MyContext) {
	const {fitting} = await getOwnShip(ctx);
	return fitting.slotsTargeted;
}

export const menu = new MenuTemplate<MyContext>(async (ctx, path) => {
	const modules = await getModules(ctx);
	const moduleIndex = Number(path.split('slot-targeted:')[1]!.split('/')[0]);
	const moduleKey = modules[moduleIndex]!;
	const module = MODULE_TARGETED[moduleKey]!;
	const moduleName = ctx.i18n.t(`static.${moduleKey}.title`);

	let text = '';
	text += module.effectsOrigin.map(o => moduleEffect(ctx, o)).join('\n');
	text += '\n\n';
	text += module.effectsTarget.map(o => moduleEffect(ctx, o)).join('\n');

	return menuBody(ctx, {
		entities: true,
		menuPosition: [EMOJIS.target + moduleName],
		shipstats: true,
		text,
	});
});

function moduleEffect(_ctx: MyContext, effect: ModuleEffect): string {
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

	const entities = await getSiteEntities(location.solarsystem, location.siteUnique);
	const list = entities
		.map((o, i) => ({entity: o, id: i}))
		.filter(o => o.entity.type !== 'player' || o.entity.id !== ownPlayerId);

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

		ctx.session.planned = ctx.session.planned?.filter(o => o.type !== 'moduleTargeted' || o.moduleIndex !== moduleIndex) ?? [];
		ctx.session.planned.push({
			type: 'moduleTargeted',
			moduleIndex,
			targetIndexInSite: Number(key),
		});

		await ctx.answerCbQuery('added to planned actions');
		return '..';
	},
});

menu.interact(EMOJIS.stop + 'Disengage', 'd', {
	hide: (ctx, path) => {
		const moduleIndex = Number(path.split('slot-targeted:')[1]!.split('/')[0]);
		return !ctx.session.planned?.some(o => o.type === 'moduleTargeted' && o.moduleIndex === moduleIndex);
	},
	do: async (ctx, path) => {
		const moduleIndex = Number(path.split('slot-targeted:')[1]!.split('/')[0]);
		ctx.session.planned = ctx.session.planned?.filter(o => o.type !== 'moduleTargeted' || o.moduleIndex !== moduleIndex) ?? [];

		await ctx.answerCbQuery('removed from planned actions');
		return '..';
	},
});

menu.manualRow(backButtons);

export async function getSlotTargetedChoices(ctx: MyContext) {
	const modules = await getModules(ctx);
	const names = modules.map((m, i) => {
		let label = '';
		if (ctx.session.planned?.some(o => o.type === 'moduleTargeted' && o.moduleIndex === i)) {
			label += '✅';
		}

		label += EMOJIS.target;
		label += ctx.i18n.t(`static.${m}.title`);
		return label;
	});
	return choicesByArrayIndex(names);
}
