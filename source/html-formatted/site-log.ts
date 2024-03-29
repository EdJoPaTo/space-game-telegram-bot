import {html as format} from 'telegram-format';

import {getPlayerPretty} from '../game/backend.js';
import {I18nContextFlavour} from '../bot/my-context.js';
import {isFacility, isPlayer} from '../game/typing-checks.js';
import {NpcFaction, Ore, Player, ShipLayout, SiteLog, SiteLogActor} from '../game/typings.js';
import {SHIP_LAYOUTS} from '../game/statics.js';
import {unreachable} from '../javascript-helper.js';

import {EMOJIS} from './emojis.js';

const PREFIX_IN = '➡️';
const PREFIX_OUT = '⬅️';

const PREFIXES = {
	warpIn: EMOJIS.warp + PREFIX_IN,
	warpOut: EMOJIS.warp + PREFIX_OUT,
	dock: EMOJIS.station + PREFIX_OUT,
	undock: EMOJIS.station + PREFIX_IN,

	collapse: '🕳',
	jump: EMOJIS.stargate + PREFIX_OUT,
	moduleTargeted: EMOJIS.target,
	rapidUnscheduledDisassembly: '🤯🔥' + EMOJIS.damage,
};

async function getHtmlPlayer(player: Player) {
	return format.bold(format.escape(
		await getPlayerPretty(player),
	));
}

function getHtmlNpc(ctx: I18nContextFlavour, faction: NpcFaction) {
	const factionLabel = format.italic(format.escape(
		ctx.i18n.t(`npcFaction.${faction}.title`),
	));
	return `${EMOJIS[faction]}${factionLabel}`;
}

function asteroidLabel(ctx: I18nContextFlavour, ore: Ore) {
	return format.italic(format.escape(
		ore + ' ' + ctx.i18n.t('static.asteroid.title'),
	));
}

function getHtmlLayoutClass(ctx: I18nContextFlavour, layout: ShipLayout) {
	const details = SHIP_LAYOUTS[layout];
	const classLabel = ctx.i18n.t(`static.${details.class}.title`);
	return format.italic(format.escape(classLabel));
}

async function actorPart(ctx: I18nContextFlavour, actor: SiteLogActor) {
	if (Array.isArray(actor)) {
		const [entity, layout] = actor;
		const layoutLabel = format.underline(format.escape(layout));
		const classLabel = getHtmlLayoutClass(ctx, layout);
		const name = isPlayer(entity) ? await getHtmlPlayer(entity) : getHtmlNpc(ctx, entity);
		return `${layoutLabel} (${name}, ${classLabel})`;
	}

	if (isFacility(actor)) {
		return format.italic(format.escape(
			ctx.i18n.t(`static.${actor}.title`),
		));
	}

	return asteroidLabel(ctx, actor);
}

export async function generateHtmlLog(ctx: I18nContextFlavour, log: readonly SiteLog[]): Promise<string> {
	// TODO: i18n templates
	const lines = await Promise.all(log.map(async entry => {
		const prefix = PREFIXES[entry.type] + ' ';

		if (entry.type === 'warpIn') {
			const actorLabel = await actorPart(ctx, entry.details);
			return prefix + `${actorLabel} warped in`;
		}

		if (entry.type === 'warpOut') {
			const actorLabel = await actorPart(ctx, entry.details);
			return prefix + `${actorLabel} warped out`;
		}

		if (entry.type === 'dock') {
			const actorLabel = await actorPart(ctx, entry.details);
			return prefix + `${actorLabel} docked`;
		}

		if (entry.type === 'undock') {
			const actorLabel = await actorPart(ctx, entry.details);
			return prefix + `${actorLabel} undocked`;
		}

		if (entry.type === 'jump') {
			const actorLabel = await actorPart(ctx, entry.details);
			return prefix + `${actorLabel} jumps with the stargate`;
		}

		if (entry.type === 'collapse') {
			const actorLabel = await actorPart(ctx, entry.details);
			return prefix + `${actorLabel} collapsed.`;
		}

		if (entry.type === 'rapidUnscheduledDisassembly') {
			const actorLabel = await actorPart(ctx, entry.details);
			return prefix + `${actorLabel} was disassembled in a spectecular way.`;
		}

		if (entry.type === 'moduleTargeted') {
			const [origin, module, target] = entry.details;
			const [originLabel, targetLabel] = await Promise.all([
				actorPart(ctx, origin),
				actorPart(ctx, target),
			]);
			const moduleLabel = format.italic(format.escape(
				ctx.i18n.t(`item.${module}.title`),
			));
			return prefix + `${originLabel} used ${moduleLabel} in the direction of ${targetLabel}`;
		}

		unreachable(entry);
	}));

	return lines.join('\n');
}
