import {EMOJIS} from '../../../html-formatted/emojis.js';
import {FACILITIES} from '../../../game/statics.js';
import {getSiteEntities} from '../../../game/backend.js';
import {MyContext} from '../../my-context.js';
import {Service} from '../../../game/typings.js';

import {isLocationSite} from '../../../game/typing-checks.js';

async function getFacilities(ctx: MyContext) {
	const {location} = ctx.game;
	if (!isLocationSite(location)) {
		throw new Error('not in a site');
	}

	const entities = await getSiteEntities(location.solarsystem, location.site);
	const list = entities
		.map((o, i) => ({entity: o, index: i}))
		.flatMap(({entity, index}) => {
			if (entity.type === 'facility') {
				const f = FACILITIES[entity.id]!;
				return f.services.map(s => ({entityIndex: index, facilityId: entity.id, service: s}));
			}

			return [];
		});

	return list;
}

export async function getFacilityChoices(ctx: MyContext) {
	const facilities = await getFacilities(ctx);
	const result: Record<string, string> = {};
	for (const {entityIndex, facilityId, service} of facilities) {
		result[`${entityIndex}-${service}`] = `${EMOJIS[facilityId]} ${ctx.i18n.t(`static.${facilityId}.title`)} → ${ctx.i18n.t(`service.${service}`)}`;
	}

	return result;
}

export async function doFacilityButton(ctx: MyContext, key: string) {
	const match = /(\d+)-(.+)/.exec(key)!;
	const facilityIndex = Number(match[1]);
	const service = match[2]! as Service;
	await ctx.game.addSiteInstructions([{
		type: 'facility',
		args: {

			targetIndexInSite: facilityIndex,
			service,
		},
	}]);
	await ctx.answerCbQuery('added to planned actions');
	return true;
}
