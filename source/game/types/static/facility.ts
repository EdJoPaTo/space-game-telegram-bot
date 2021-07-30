export type Service = 'dock' | 'jump';

/**
 * Facilities are things like Stargates or Stations.
 * They offer services while in the same site.
 **/
export interface Facility {
	readonly services: readonly Service[];
}

export type FacilityIdentifier = `facility${number}`;
export const FACILITIES: Readonly<Record<string, Facility>> = {
	facility1: {
		// Station
		services: ['dock'],
	},
	facility2: {
		// Stargate
		services: ['jump'],
	},
};
