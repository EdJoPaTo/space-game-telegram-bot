import {choicesByArrayIndex, getOwnShip} from '../general.js';
import {EMOJIS} from '../../emojis.js';
import {MyContext} from '../../my-context.js';

async function getModules(ctx: MyContext) {
	const {fitting} = await getOwnShip(ctx);
	return fitting.slotsUntargeted;
}

export async function getSlotUntargetedChoices(ctx: MyContext) {
	const modules = await getModules(ctx);
	const names = modules.map(m => EMOJIS.self + ctx.i18n.t(`module.${m}.title`));
	return choicesByArrayIndex(names);
}

export function isSlotUntargetedButtonSet(ctx: MyContext, key: string) {
	const moduleIndex = Number(key);
	return Boolean(ctx.session.planned?.some(o => o.type === 'moduleUntargeted' && o.args.moduleIndex === moduleIndex));
}

export async function setSlotUntargetedButton(ctx: MyContext, key: string, newState: boolean) {
	const moduleIndex = Number(key);
	ctx.session.planned = ctx.session.planned?.filter(o => o.type !== 'moduleUntargeted' || o.args.moduleIndex !== moduleIndex) ?? [];
	if (newState) {
		ctx.session.planned.push({type: 'moduleUntargeted', args: {moduleIndex}});
	}

	await ctx.answerCbQuery('added to planned actions');
	return true;
}
