import {SHIP_LAYOUTS, MODULE_PASSIVE} from './get-static.js';
import {ShipFitting} from './typings.js';

export function getShipQuickstats(fitting: ShipFitting) {
	const layout = SHIP_LAYOUTS[fitting.layout]!;
	const moduleQualites = fitting.slotsPassive
		.map(o => MODULE_PASSIVE[o])
		.map(o => o ? o.qualities : {});
	const qualities = [layout.qualities, ...moduleQualites];

	let armor = 0;
	let structure = 0;
	let capacitor = 0;
	let capacitorRecharge = 0;
	for (const q of qualities) {
		armor += q.hitpointsArmor ?? 0;
		structure += q.hitpointsStructure ?? 0;
		capacitor += q.capacitor ?? 0;
		capacitorRecharge += q.capacitorRecharge ?? 0;
	}

	return {
		armor,
		structure,
		capacitor,
		capacitorRecharge,
	};
}
