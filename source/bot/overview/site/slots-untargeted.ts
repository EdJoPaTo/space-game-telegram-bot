import {choicesByArrayIndex} from '../../general.js';
import {EMOJIS} from '../../../html-formatted/emojis.js';
import {MyContext} from '../../my-context.js';

async function getModules(ctx: MyContext) {
	const {fitting} = await ctx.game.getShip();
	return fitting.slotsUntargeted;
}

export async function getSlotUntargetedChoices(ctx: MyContext) {
	const modules = await getModules(ctx);
	const names = modules.map(m => EMOJIS.self + ctx.i18n.t(`module.${m}.title`));
	return choicesByArrayIndex(names);
}

export async function doSlotUntargetedButton(ctx: MyContext, key: string) {
	const moduleIndex = Number(key);
	await ctx.game.addSiteInstructions([{
		type: 'moduleUntargeted', args: {moduleIndex},
	}]);
	await ctx.answerCbQuery('added to planned actions');
	return true;
}
