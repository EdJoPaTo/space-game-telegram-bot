import {readFileSync} from 'fs';

import {
	Facility,
	FacilityDetails,
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
	const content = readFileSync(`../typings/static/${filename}.json`, 'utf8');
	return JSON.parse(content) as unknown;
}

export const FACILITIES = read('facility') as Record<Facility, FacilityDetails>;
export const MODULE_PASSIVE = read('module-passive') as Record<ModulePassive, ModulePassiveDetails>;
export const MODULE_TARGETED = read('module-targeted') as Record<ModuleTargeted, ModuleTargetedDetails>;
export const MODULE_UNTARGETED = read('module-untargeted') as Record<ModuleUntargeted, ModuleUntargetedDetails>;
export const SHIP_LAYOUTS = read('ship-layout') as Record<ShipLayout, ShipLayoutDetails>;
export const SOLARSYSTEMS = read('solarsystem') as Record<Solarsystem, SolarsystemDetails>;
