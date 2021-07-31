export type Service = 'dock' | 'jump';

/**
 * Facilities are things like Stargates or Stations.
 * They offer services while in the same site.
 **/
export interface Facility {
	readonly services: readonly Service[];
}

export type FacilityIdentifier =
| 'facilityStargate'
| 'facilityStation';

export const FACILITIES: Readonly<Record<FacilityIdentifier, Facility>> = {
	facilityStation: {
		services: ['dock'],
	},
	facilityStargate: {
		services: ['jump'],
	},
};
