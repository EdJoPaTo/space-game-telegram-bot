export interface ShipLayout {
	readonly slotsTargeted: number;
	readonly slotsSelf: number;
	readonly slotsPassive: number;

	/** Needed by high tech devices like scanners */
	readonly cpu: number;
	/** Needed by low tech devices like weapons */
	readonly powergrid: number;
	/** Energy needed to activate modules */
	readonly capacitor: number;
	/** Energy recharged per round */
	readonly capacitorRecharge: number;

	readonly hitpointsArmor: number;
	readonly hitpointsStructure: number;
}

export type ShipLayoutIdentifier = `shipl${number}`;
export const SHIP_LAYOUTS: Readonly<Record<string, ShipLayout>> = {
	shipl1: {
		// Rookie Ship
		slotsTargeted: 2,
		slotsSelf: 1,
		slotsPassive: 1,
		cpu: 30,
		powergrid: 50,
		capacitor: 40,
		capacitorRecharge: 5,
		hitpointsArmor: 20,
		hitpointsStructure: 10,
	},
};
