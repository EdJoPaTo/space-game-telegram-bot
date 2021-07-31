import {PlayerIdentifier, PlayerLocation, PlayerPretty} from './types/dynamic/player.js';
import {SiteInterals, SitesNearPlanet} from './types/dynamic/site.js';
import {SolarsystemIdentifier} from './types/static/solarsystems.js';

export async function getPlayerPretty(playerId: PlayerIdentifier): Promise<PlayerPretty> {
	const name = playerId.includes('tg') ? 'You' : 'Bob';
	return {name};
}

export async function getPlayerLocation(_playerId: PlayerIdentifier): Promise<PlayerLocation> {
	return {
		solarsystem: 'system1',
		site: {
			type: 'facilityStation',
			unique: 'station1',
			name: 'Wabinihwa I',
		},
		shipFitting: {
			layout: 'shiplayout1',
			slotsTargeted: ['modt2', 'modt1'],
			slotsSelf: ['mods1'],
			slotsPassive: ['modp1'],
		},
		shipStatus: {
			capacitor: 40,
			armor: 20,
			structure: 10,
		},
	};
}

/** Get information which is only visible from within the site */
export async function getSiteInternals(_solarsystem: SolarsystemIdentifier, _unique: string): Promise<SiteInterals> {
	return {
		entities: [{
			type: 'facility',
			id: 'facilityStation',
		}, {
			type: 'lifeless',
			id: 'lifeless1',
		}, {
			type: 'lifeless',
			id: 'lifeless1',
		}, {
			type: 'npc',
			shiplayout: 'shiplayout2',
		}, {
			type: 'lifeless',
			id: 'lifeless1',
		}, {
			type: 'player',
			id: 'player-dummy-0',
			shiplayout: 'shiplayout1',
		}, {
			type: 'npc',
			shiplayout: 'shiplayout2',
		}],
	};
}

export async function getSites(_solarsystem: SolarsystemIdentifier): Promise<SitesNearPlanet> {
	return {
		1: [{
			type: 'asteroidField',
			unique: 'a0-some-hex',
		}],
		2: [{
			type: 'facilityStation',
			unique: 'station1',
			name: 'Wabinihwa I',
		}, {
			type: 'asteroidField',
			unique: 'a1-backend',
		}, {
			type: 'asteroidField',
			unique: 'a2-will-be',
		}],
		3: [{
			type: 'facilityStargate',
			unique: 'system2',
			name: 'Liagi',
		}],
		4: [{
			type: 'facilityStargate',
			unique: 'system4',
			name: 'Arama',
		}, {
			type: 'asteroidField',
			unique: 'a3-more-creative',
		}],
	};
}
