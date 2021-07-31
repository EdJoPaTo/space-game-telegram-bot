import {MenuTemplate} from 'telegraf-inline-menu';

import {backButtons} from '../general.js';
import {EMOJIS} from '../../emojis.js';
import {FACILITIES, Service} from '../../../game/types/static/facility.js';
import {getSiteInternals} from '../../../game/get-whatever.js';
import {menuBody} from '../body.js';
import {MyContext} from '../../my-context.js';

import {getPlayerInSite} from './helper.js';

export const menu = new MenuTemplate<MyContext>(async ctx => menuBody(ctx, {
	entities: true,
	menuPosition: ['Facilities'],
	shipstats: true,
}));

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

async function getChoices(ctx: MyContext) {
	const facilities = await getFacilities(ctx);
	const result: Record<string, string> = {};
	for (const {entityIndex, facilityId, service} of facilities) {
		result[`${entityIndex}-${service}`] = `${EMOJIS[facilityId]} ${ctx.i18n.t(`static.${facilityId}.title`)} → ${ctx.i18n.t(`service.${service}`)}`;
	}

	return result;
}

menu.choose('', getChoices, {
	do: async (ctx, key) => {
		const match = /(\d+)-(.+)/.exec(key)!;
		const facilityId = Number(match[1]);
		const service = match[2]! as Service;
		ctx.session.planned = [{
			type: 'facility',
			targetIdInSite: facilityId,
			service,
		}];
		return '..';
	},
});

menu.manualRow(backButtons);
