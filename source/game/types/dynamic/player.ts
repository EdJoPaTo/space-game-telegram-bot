import {SolarsystemIdentifier} from '../static/solarsystems.js';

import {ShipFitting, ShipStatus} from './ship.js';
import {SiteInfo} from './site.js';

/** Example: player-tg-1337 */
export type PlayerIdentifier = `player-${string}-${number}`;
export type PlayerTelegramIdentifier = `player-tg-${number}`;

interface StationIdentifier {
	readonly solarsystem: SolarsystemIdentifier;
	readonly station: number;
}

export type PlayerLocation = PlayerAtStation | PlayerInSpace | PlayerInSite;

/** Written by Backend */
export interface PlayerAtStation {
	readonly solarsystem: SolarsystemIdentifier;
	readonly station: number;
}

/**
 * Written by Backend.
 * Site is undefined when in warp between sites
 */
export interface PlayerInSpace {
	readonly solarsystem: SolarsystemIdentifier;

	readonly shipFitting: ShipFitting;
	readonly shipStatus: ShipStatus;
}

/**
 * Written by Backend.
 * Site is undefined when in warp between sites
 */
export interface PlayerInSite extends PlayerInSpace {
	readonly site: SiteInfo;
}

/** Global information about a player. Only written by player while at station */
export interface PlayerGlobals {
	readonly home: StationIdentifier;
}

/** Player can edit while in station */
export interface PlayerStationAssets {
	readonly solarsystem: SolarsystemIdentifier;
	readonly station: number;
	/** When a player docks the Ship is added to the station. When undocking one ship has to be used (by backend?). */
	readonly ships: ShipFitting[];
}

/** Backend doesnt care about these */
export interface PlayerPretty {
	readonly name: string;
}
