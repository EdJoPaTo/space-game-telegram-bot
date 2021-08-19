import {addSiteInstructions} from '../../../game/backend.js';
import {choicesByArrayIndex} from '../../general.js';
import {EMOJIS} from '../../../html-formatted/emojis.js';
import {getOwnIdentifier, getOwnShip} from '../general.js';
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

export async function doSlotUntargetedButton(ctx: MyContext, key: string) {
	const moduleIndex = Number(key);
	await addSiteInstructions(getOwnIdentifier(ctx), [{
		type: 'moduleUntargeted', args: {moduleIndex},
	}]);
	await ctx.answerCbQuery('added to planned actions');
	return true;
}
