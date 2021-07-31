import {EMOJIS} from '../../emojis.js';
import {FACILITIES, Service} from '../../../game/types/static/facility.js';
import {getSiteInternals} from '../../../game/get-whatever.js';
import {MyContext} from '../../my-context.js';

import {getPlayerInSite} from './helper.js';

async function getFacilities(ctx: MyContext) {
	const location = await getPlayerInSite(ctx);
	const {entities} = await getSiteInternals(location.solarsystem, location.site.unique);
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
	ctx.session.planned = [{
		type: 'facility',
		targetIndexInSite: facilityIndex,
		service,
	}];
	await ctx.answerCbQuery('added to planned actions');
	return true;
}
