import {EMOJIS} from '../../../html-formatted/emojis.js';
import {FACILITIES} from '../../../game/statics.js';
import {getSiteEntities} from '../../../game/backend.js';
import {isPlayerLocationSite, isSiteEntityFacility, Service} from '../../../game/typings.js';
import {MyContext} from '../../my-context.js';

async function getFacilities(ctx: MyContext) {
	const {location} = ctx.game;
	if (!isPlayerLocationSite(location)) {
		throw new Error('not in a site');
	}

	const entities = await getSiteEntities(location.solarsystem, location.site);
	const list = entities
		.map((o, i) => ({entity: o, index: i}))
		.flatMap(({entity, index}) => {
			if (isSiteEntityFacility(entity)) {
				const f = FACILITIES[entity.facility]!;
				return f.services.map(s => ({entityIndex: index, facilityId: entity.facility, service: s}));
			}

			return [];
		});

	return list;
}

export async function getFacilityChoices(ctx: MyContext) {
	const facilities = await getFacilities(ctx);
	const result: Record<string, string> = {};
	for (const {entityIndex, facilityId, service} of facilities) {
		result[`${entityIndex}-${service}`] = `${EMOJIS[facilityId]} ${ctx.i18n.t(`static.${facilityId}.title`)} → ${ctx.i18n.t(`service.${service}.button`)}`;
	}

	return result;
}

export async function doFacilityButton(ctx: MyContext, key: string) {
	await ctx.answerCbQuery();
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
	await ctx.editMessageText(ctx.i18n.t(`service.${service}.starting`));
	return false;
}
