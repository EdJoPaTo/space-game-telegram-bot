import {SolarsystemIdentifier} from '../static/solarsystems.js';

import {ShipFitting, ShipStatus} from './ship.js';
import {SiteIdentifier} from './site.js';

interface StationIdentifier {
	readonly solarsystem: SolarsystemIdentifier;
	readonly station: number;
}

export type PlayerLocation = PlayerAtStation | PlayerInSpace;

/** Written by Backend */
export interface PlayerAtStation {
	readonly solarsystem: SolarsystemIdentifier;
	readonly station: number;
}

/** Written by Backend */
export interface PlayerInSpace {
	readonly solarsystem: SolarsystemIdentifier;
	/** Site is undefined when in warp between sites */
	readonly site?: SiteIdentifier;

	readonly shipFitting: ShipFitting;
	readonly shipStatus: ShipStatus;
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
