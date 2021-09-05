import {readFileSync} from 'fs';

import {typedEntities} from '../javascript-helper.js';

import {
	Facility,
	FacilityDetails,
	Item,
	ItemCategory,
	ItemDetails,
	ModulePassive,
	ModulePassiveDetails,
	ModuleTargeted,
	ModuleTargetedDetails,
	ModuleUntargeted,
	ModuleUntargetedDetails,
	ShipLayout,
	ShipLayoutDetails,
	Solarsystem,
	SolarsystemDetails,
} from './typings.js';

function read(filename: string) {
	const content = readFileSync(`static/${filename}.json`, 'utf8');
	return JSON.parse(content) as unknown;
}

export const FACILITIES = read('facility') as Record<Facility, FacilityDetails>;
export const ITEMS = read('item') as Record<Item, ItemDetails>;
export const MODULE_PASSIVE = read('module-passive') as Record<ModulePassive, ModulePassiveDetails>;
export const MODULE_TARGETED = read('module-targeted') as Record<ModuleTargeted, ModuleTargetedDetails>;
export const MODULE_UNTARGETED = read('module-untargeted') as Record<ModuleUntargeted, ModuleUntargetedDetails>;
export const SHIP_LAYOUTS = read('ship-layout') as Record<ShipLayout, ShipLayoutDetails>;
export const SOLARSYSTEMS = read('solarsystem') as Record<Solarsystem, SolarsystemDetails>;

export const ITEMS_BY_CATEGORY: Readonly<Record<ItemCategory, readonly Item[]>> = generateItemsByCategory();
function generateItemsByCategory(): Readonly<Record<ItemCategory, readonly Item[]>> {
	const result: Partial<Record<ItemCategory, Item[]>> = {};

	for (const [item, details] of typedEntities(ITEMS)) {
		const {category} = details;
		if (!result[category]) {
			result[category] = [];
		}

		result[category]!.push(item);
	}

	// @ts-expect-error Partial to Full
	return result;
}
