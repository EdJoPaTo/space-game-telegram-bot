import {html as format} from 'telegram-format';

import {EMOJIS} from '../../emojis.js';
import {getPlayerPretty} from '../../../game/get-whatever.js';
import {isPlayer} from '../../../game/typing-checks.js';
import {MyContext} from '../../my-context.js';
import {NpcFaction, Player, ShipLayout, SiteLog, SiteLogActor} from '../../../game/typings.js';
import {SHIP_LAYOUTS} from '../../../game/get-static.js';
import {unreachable} from '../../../javascript-helper.js';

const PREFIX_IN = '➡️';
const PREFIX_OUT = '⬅️';

const PREFIXES = {
	warpIn: '🚀' + PREFIX_IN,
	warpOut: '🚀' + PREFIX_OUT,
	dock: EMOJIS.station + PREFIX_OUT,
	undock: EMOJIS.station + PREFIX_IN,

	jump: EMOJIS.stargate + PREFIX_OUT,
	rapidUnscheduledDisassembly: '🤯🔥' + EMOJIS.damage,
	moduleTargeted: EMOJIS.target,
};

async function getHtmlPlayer(player: Player) {
	return format.bold(format.escape(
		await getPlayerPretty(player),
	));
}

function getHtmlNpc(ctx: MyContext, faction: NpcFaction) {
	const factionLabel = format.italic(format.escape(
		ctx.i18n.t(`npcFaction.${faction}.title`),
	));
	return `${EMOJIS[faction]}${factionLabel}`
}

function getHtmlLayoutClass(ctx: MyContext, layout: ShipLayout) {
	const details = SHIP_LAYOUTS[layout];
	const classLabel = ctx.i18n.t(`static.${details.class}.title`);
	return format.italic(format.escape(classLabel));
}

async function actorPart(ctx: MyContext, actor: SiteLogActor) {
	if (Array.isArray(actor)) {
		const [entity, layout] = actor;
		const layoutLabel = format.underline(format.escape(layout));
		const classLabel = getHtmlLayoutClass(ctx, layout);
		const name = isPlayer(entity) ? await getHtmlPlayer(entity) : getHtmlNpc(ctx, entity)
		return `${layoutLabel} (${name}, ${classLabel})`
	}

	return ctx.i18n.t(`static.${actor}`);
}

export async function generateHtmlLog(ctx: MyContext, log: readonly SiteLog[]): Promise<string> {
	// TODO: i18n templates
	const lines = await Promise.all(log.map(async entry => {
		const prefix = PREFIXES[entry.type] + ' ';

		if (entry.type === 'warpIn') {
			const actorLabel = await actorPart(ctx, entry.details);
			return prefix + `${actorLabel} warped in`;
		}

		if (entry.type === 'warpOut') {
			const actorLabel = await actorPart(ctx, entry.details);
			return prefix +  `${actorLabel} warped out`;
		}

		if (entry.type === 'dock') {
			const actorLabel = await actorPart(ctx, entry.details);
			return prefix +  `${actorLabel} docked`;
		}

		if (entry.type === 'undock') {
			const actorLabel = await actorPart(ctx, entry.details);
			return prefix +  `${actorLabel} undocked`;
		}

		if (entry.type === 'jump') {
			const actorLabel = actorPart(ctx, entry.details);
			return prefix +  `${actorLabel} jumps with the stargate`;
		}

		if (entry.type === 'rapidUnscheduledDisassembly') {
			const actorLabel = await actorPart(ctx, entry.details);
			return prefix +  `${actorLabel} was disassembled in a spectecular way.`;
		}

		if (entry.type === 'moduleTargeted') {
			const [origin, module, target] = entry.details;
			const [originLabel, targetLabel] = await Promise.all([
				actorPart(ctx, origin),
				actorPart(ctx, target),
			]);
			const moduleLabel = format.italic(format.escape(
				ctx.i18n.t(`module.${module}.title`),
			));
			return prefix +  `${originLabel} used ${moduleLabel} in the direction of ${targetLabel}`;
		}

		unreachable(entry);
	}));

	return lines.join('\n');
}
