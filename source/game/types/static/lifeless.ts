/** Stuff like asteroids being in sites but dont act themselves */
export interface Lifeless {
	readonly hitpointsArmor: number;
	readonly hitpointsStructure: number;
	// TODO: mineable resources
	// TODO: lootable resources
	// TODO: hackable resources
}

export type LifelessIdentifier = `lifeless${number}`;
export const LIFELESS: Readonly<Record<string, Lifeless>> = {
	lifeless1: {
		// Asteroid
		hitpointsArmor: 0,
		hitpointsStructure: 42,
	},
};
