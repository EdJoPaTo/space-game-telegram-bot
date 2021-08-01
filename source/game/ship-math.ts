import {SHIP_LAYOUTS} from './get-static.js';
import {ShipFitting} from './typings.js';

export function getShipQuickstats(fitting: ShipFitting) {
	const layout = SHIP_LAYOUTS[fitting.layout]!;

	// TODO: account for passive modules

	return {
		armor: layout.hitpointsArmor,
		structure: layout.hitpointsStructure,
		capacitor: layout.capacitor,
		capacitorRecharge: layout.capacitorRecharge,
	};
}
