import {readFileSync} from 'fs';

import {Facility, FacilityIdentifier, ModuleUntargeted, ModuleTargeted, ShipLayout, Solarsystem} from './typings.js';

function read(filename: string) {
	const content = readFileSync(`../typings/static/${filename}.json`, 'utf8');
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return JSON.parse(content);
}

export const FACILITIES = read('facility') as Record<FacilityIdentifier, Facility>;
export const MODULE_UNTARGETED = read('module-untargeted') as Record<string, ModuleUntargeted>;
export const MODULE_TARGETED = read('module-targeted') as Record<string, ModuleTargeted>;
export const SHIP_LAYOUTS = read('ship-layout') as Record<string, ShipLayout>;
export const SOLARSYSTEMS = read('solarsystem') as Record<string, Solarsystem>;
