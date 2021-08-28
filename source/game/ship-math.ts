import {SHIP_LAYOUTS, MODULE_PASSIVE} from './statics.js';
import {ShipFitting, Storage} from './typings.js';

export function getShipQuickstats(fitting: ShipFitting) {
	const layout = SHIP_LAYOUTS[fitting.layout]!;
	const passiveModules = fitting.slotsPassive
		.map(o => MODULE_PASSIVE[o]!);

	let {armor} = layout;
	const {structure, capacitor} = layout;
	const capacitorRecharge = layout.roundEffects.find(o => o.type === 'capacitorRecharge')?.amount ?? 0;
	for (const m of passiveModules) {
		armor += m.hitpointsArmor;
	}

	return {
		armor,
		structure,
		capacitor,
		capacitorRecharge,
	};
}

export function getCargoSlotsUsed(storage: Storage | undefined) {
	let used = 0;
	for (const amount of Object.values(storage ?? {})) {
		used += amount ?? 0;
	}

	return used;
}
