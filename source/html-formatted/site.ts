import {html as format} from 'telegram-format';

import {getPlayerPretty} from '../game/backend.js';
import {I18nContextFlavour} from '../bot/my-context.js';
import {SHIP_LAYOUTS} from '../game/statics.js';
import {Site, SiteEntity, Solarsystem} from '../game/typings.js';

import {EMOJIS, getRomanNumber, percentageFraction} from './emojis.js';

export function siteLabel(ctx: I18nContextFlavour, solarsystem: Solarsystem, site: Site, includeFormat: boolean) {
	let label = '';

	label += EMOJIS[site.kind];
	label += ctx.i18n.t(`static.${site.kind}.title`);
	label += ' ';

	if (site.kind === 'station') {
		const value = `${solarsystem} ${getRomanNumber(site.unique + 1)}`;
		label += includeFormat ? format.underline(value) : value;
	} else if (site.kind === 'stargate') {
		label += includeFormat ? format.underline(site.unique) : site.unique;
	} else {
		let value = site.unique.toString(16);
		while (value.length < 2) {
			value = '0' + value;
		}

		label += includeFormat ? format.monospace(value) : value;
	}

	return label;
}

export async function entityPart(ctx: I18nContextFlavour, entities: readonly SiteEntity[], filter: (o: SiteEntity) => boolean = () => true) {
	const lines = await Promise.all(entities
		.map((o, i) => ({o, i}))
		.filter(({o}) => filter(o))
		.map(async ({o, i}) => {
			let type: string;
			let shipclassLabel: string | undefined;
			if ('shiplayout' in o) {
				const shipclass = SHIP_LAYOUTS[o.shiplayout]!.class;
				shipclassLabel = ctx.i18n.t(`static.${shipclass}.title`);
				type = o.shiplayout;
			} else {
				type = ctx.i18n.t(`static.${o.id}.title`);
			}

			let owner: string | undefined;
			if (o.type === 'npc') {
				owner = EMOJIS[o.faction] + ctx.i18n.t(`npcFaction.${o.faction}.title`);
			} else if (o.type === 'player') {
				owner = await getPlayerPretty(o.id);
			}

			const armor = 'armor' in o ? o.armor : 0;
			const structure = 'structure' in o ? o.structure : 0;

			return entityLine(i + 1, entities.length, type, shipclassLabel, armor, structure, owner);
		}),
	);
	return lines.join('\n');
}

function entityLine(id: number, total: number, type: string, shipclassLabel: string | undefined, armor: number, structure: number, owner?: string): string {
	let text = '';

	const idText = String(id);
	const idTargetWidth = Math.max(1, Math.floor(Math.log10(total)) + 1);
	const missing = Math.max(0, idTargetWidth - idText.length);
	const idPart = ' '.repeat(missing) + idText;
	text += format.monospace(idPart);
	text += ' ';

	text += format.bold(type);

	if (shipclassLabel) {
		text += ' (';
		text += shipclassLabel;
		text += ')';
	}

	if (armor) {
		text += ' ';
		text += percentageFraction(armor);
		text += EMOJIS.hitpointsArmor;
	}

	if (structure) {
		text += ' ';
		text += percentageFraction(structure);
		text += EMOJIS.hitpointsStructure;
	}

	if (owner) {
		text += ' ' + format.escape(owner);
	}

	return text;
}
