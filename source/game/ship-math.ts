import {SHIP_LAYOUTS, MODULE_PASSIVE} from './get-static.js';
import {ShipFitting} from './typings.js';

export function getShipQuickstats(fitting: ShipFitting) {
	const layout = SHIP_LAYOUTS[fitting.layout]!;
	const passiveModules = fitting.slotsPassive
		.map(o => MODULE_PASSIVE[o]!);

	let armor = layout.hitpointsArmor;
	let structure = layout.hitpointsStructure;
	let capacitor = layout.capacitor;
	let capacitorRecharge = layout.roundEffects.find(o => o.type === 'capacitorRecharge')?.amount ?? 0;
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
