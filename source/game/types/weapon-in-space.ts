import {ObjectInSpace} from './object-in-space';

export type WeaponInSpace = Missile | Projectile;
interface WeaponInSpaceBase extends ObjectInSpace {
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
