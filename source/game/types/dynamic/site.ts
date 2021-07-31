import {FacilityIdentifier} from '../static/facility.js';
import {LifelessIdentifier} from '../static/lifeless.js';
import {ShipLayoutIdentifier} from '../static/shiplayout.js';
import {SiteType} from '../static/site.js';

import {PlayerIdentifier} from './player.js';

/**
 * Generic info of a site which will not change as long as its existing.
 * Created by the backend, readonly for frontend.
 */
export interface SiteInfo {
	readonly type: SiteType;
	/** The site can be uniquely identified with the system and its unique */
	readonly unique: string;
	/** Sites that have names which arnt generic */
	readonly name?: string;
}

export type SitesNearPlanet = Record<number, readonly SiteInfo[]>;

export type Entity = Facility | Lifeless | NPC | Player;

export interface Facility {
	readonly type: 'facility';
	readonly id: FacilityIdentifier;
}

export interface Lifeless {
	readonly type: 'lifeless';
	readonly id: LifelessIdentifier;
	/** The front frontend doesnt even need this content */
	// readonly status: LifelessStatus;
}

export interface NPC {
	readonly type: 'npc';
	readonly shiplayout: ShipLayoutIdentifier;

	/** The front frontend doesnt even need this content */
	// readonly fitting: ShipFitting;
	// readonly status: ShipStatus;

	// TODO: race / group? something like pirates, guards, … -> different logic
}

/** Grab Fitting and status from PlayerInSpace infos? */
export interface Player {
	readonly type: 'player';
	readonly id: PlayerIdentifier;
	readonly shiplayout: ShipLayoutIdentifier;
}

/**
 * Get information which is only visible from within the site.
 * Written by backend, readonly for frontend.
 */
export interface SiteInterals {
	readonly entities: readonly Entity[];
}
