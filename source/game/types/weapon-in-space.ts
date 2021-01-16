import {ObjectInSpace} from './object-in-space';

export const MINIMUM_WEAPON_DAMAGE_POTENTIAL = 0.001;

export type WeaponInSpace = Missile | Projectile;
interface WeaponInSpaceBase extends ObjectInSpace {
	// Override base to be non nullable as it has to go somewhere
	readonly direction: NonNullable<ObjectInSpace['direction']>;

	readonly playerId: string;

	/**
	 * Percentage of modules it destroys on a given position
	 */
	readonly damagePotential: number;
}

export interface Missile extends WeaponInSpaceBase {
}

/** Projectile from PDC or Railgun */
export interface Projectile extends WeaponInSpaceBase {
	/**
	 * Factor of lost damage potential per movement.
	 * Simulates bad tracking speed, inaccuracy of produces rounds, …
	 */
	readonly lossPerDistance: number;
}
