import {MenuTemplate} from 'telegraf-inline-menu';

import {backButtons, choicesByArrayIndex} from '../../general.js';
import {EMOJIS} from '../../../html-formatted/emojis.js';
import {entityButtonLabel} from '../../../html-formatted/site.js';
import {getSiteEntities} from '../../../game/backend.js';
import {isPlayerLocationSite, isSiteEntityPlayer} from '../../../game/typings.js';
import {itemDescriptionPart} from '../../../html-formatted/item.js';
import {MyContext} from '../../my-context.js';

import {siteBody} from './body.js';

async function getModules(ctx: MyContext) {
	const {fitting} = await ctx.game.getShip();
	return fitting.slotsTargeted;
}

export const menu = new MenuTemplate<MyContext>(async (ctx, path) => {
	const modules = await getModules(ctx);
	const moduleIndex = Number(path.split('slot-targeted:')[1]!.split('/')[0]);
	const module = modules[moduleIndex]!;
	const moduleName = ctx.i18n.t(`item.${module}.title`);
	return siteBody(ctx, {
		menuPosition: [EMOJIS.target + moduleName],
		text: itemDescriptionPart(ctx, module, {
			hideInfrastructure: true,
			hideRecycle: true,
		}),
	});
});

async function getTargets(ctx: MyContext) {
	const {location, ownPlayerId} = ctx.game;
	if (!isPlayerLocationSite(location)) {
		throw new Error('not in a site');
	}

	const entities = await getSiteEntities(location.solarsystem, location.site);
	const list = entities
		.map((o, i) => ({entity: o, index: i}))
		.filter(o => !isSiteEntityPlayer(o.entity) || o.entity.player.platform !== ownPlayerId.platform || o.entity.player.id !== ownPlayerId.id);

	const result: Record<number, string> = {};
	for (const {index, entity} of list) {
		// eslint-disable-next-line no-await-in-loop
		const label = await entityButtonLabel(ctx, index, entities.length, entity);
		result[index] = EMOJIS.target + label;
	}

	return result;
}

menu.choose('t', getTargets, {
	columns: 2,
	do: async (ctx, key) => {
		if (!('data' in ctx.callbackQuery!)) {
			throw new Error('wat?');
		}

		const path = ctx.callbackQuery.data;
		const moduleIndex = Number(path.split('slot-targeted:')[1]!.split('/')[0]);

		await ctx.game.addSiteInstructions([{
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
	const names = modules.map(m => EMOJIS.target + ctx.i18n.t(`item.${m}.title`));
	return choicesByArrayIndex(names);
}
