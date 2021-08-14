import {html as format} from 'telegram-format';

import {EMOJIS} from '../../emojis.js';
import {getPlayerPretty} from '../../../game/get-whatever.js';
import {isPlayer} from '../../../game/typing-checks.js';
import {MyContext} from '../../my-context.js';
import {NpcFaction, Player, ShipLayout, SiteLog, SiteLogActor} from '../../../game/typings.js';
import {SHIP_LAYOUTS} from '../../../game/get-static.js';
import {unreachable} from '../../../javascript-helper.js';

async function getHtmlPlayer(player: Player) {
	return format.bold(format.escape(
		await getPlayerPretty(player),
	));
}

function getHtmlLayoutClass(ctx: MyContext, layout: ShipLayout) {
	const details = SHIP_LAYOUTS[layout];
	const classLabel = ctx.i18n.t(`static.${details.class}.title`);
	return format.italic(format.escape(classLabel));
}

async function playerPart(ctx: MyContext, [player, layout]: [Player, ShipLayout]) {
	const name = await getHtmlPlayer(player);
	const classLabel = getHtmlLayoutClass(ctx, layout);
	return `${name} (${format.underline(format.escape(layout))}, ${classLabel})`;
}

function npcPart(ctx: MyContext, [faction, layout]: [NpcFaction, ShipLayout]) {
	const factionLabel = format.italic(format.escape(
		ctx.i18n.t(`npcFaction.${faction}.title`),
	));
	const classLabel = getHtmlLayoutClass(ctx, layout);
	return `${EMOJIS[faction]}${format.underline(format.escape(layout))} (${classLabel}, ${factionLabel})`;
}

async function actorPart(ctx: MyContext, actor: SiteLogActor) {
	if (Array.isArray(actor)) {
		const [entity, layout] = actor;
		if (isPlayer(entity)) {
			return playerPart(ctx, [entity, layout]);
		}

		return npcPart(ctx, [entity, layout]);
	}

	return ctx.i18n.t(`static.${actor}`);
}

export async function generateHtmlLog(ctx: MyContext, log: readonly SiteLog[]): Promise<string> {
	// TODO: i18n templates
	const lines = await Promise.all(log.map(async entry => {
		if (entry.type === 'warpIn') {
			const playerLabel = await playerPart(ctx, entry.details);
			return `${playerLabel} warped in`;
		}

		if (entry.type === 'warpOut') {
			const playerLabel = await playerPart(ctx, entry.details);
			return `${playerLabel} warped out`;
		}

		if (entry.type === 'dock') {
			const playerLabel = await playerPart(ctx, entry.details);
			return `${playerLabel} docked`;
		}

		if (entry.type === 'undock') {
			const playerLabel = await playerPart(ctx, entry.details);
			return `${playerLabel} undocked`;
		}

		if (entry.type === 'appears') {
			const npcLabel = npcPart(ctx, entry.details);
			return `${npcLabel} appears from the shadows`;
		}

		if (entry.type === 'rapidUnscheduledDisassembly') {
			const actorLabel = await actorPart(ctx, entry.details);
			return `${EMOJIS.damage} ${actorLabel} was disassembled in a spectecular way.`;
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
			return `${originLabel} used ${moduleLabel} in the direction of ${targetLabel}`;
		}

		unreachable(entry);
	}));

	return lines.join('\n');
}
