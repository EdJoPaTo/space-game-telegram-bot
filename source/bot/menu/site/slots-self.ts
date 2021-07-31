import {choicesByArrayIndex} from '../general.js';
import {EMOJIS} from '../../emojis.js';
import {MyContext} from '../../my-context.js';

import {getPlayerInSpace} from './helper.js';

async function getModules(ctx: MyContext) {
	const info = await getPlayerInSpace(ctx);
	return info.shipFitting.slotsSelf;
}

export async function getSlotSelfChoices(ctx: MyContext) {
	const modules = await getModules(ctx);
	const names = modules.map(m => EMOJIS.self + ctx.i18n.t(`static.${m}.title`));
	return choicesByArrayIndex(names);
}

export async function doSlotSelfButton(ctx: MyContext, key: string) {
	const moduleIndex = Number(key);
	ctx.session.planned = ctx.session.planned?.filter(o => o.type !== 'module-self' || o.moduleIndex !== moduleIndex) ?? [];
	ctx.session.planned.push({type: 'module-self', moduleIndex});
	await ctx.answerCbQuery('added to planned actions');
	return true;
}
