import {PlayerIdentifier, PlayerLocation, SiteInternals, SitesNearPlanet} from './typings.js';

export async function getPlayerPretty(playerId: string) {
	const name = playerId.includes('tg') ? 'You' : 'Bob';
	return {name};
}

export async function getPlayerLocation(_playerId: PlayerIdentifier): Promise<PlayerLocation> {
	return {
		solarsystem: 'system1',
		site: {
			kind: 'facilityStation',
			unique: 'station1',
			name: 'Wabinihwa I',
		},
		shipFitting: {
			layout: 'shiplayoutRookieShip',
			slotsTargeted: ['modtRookieMiningLaser', 'modtRookieLaser'],
			slotsUntargeted: ['moduRookieArmorRepair'],
			slotsPassive: ['modpRookieArmorPlate'],
		},
		shipStatus: {
			capacitor: 40,
			hitpointsArmor: 20,
			hitpointsStructure: 10,
		},
	};
}

/** Get information which is only visible from within the site */
export async function getSiteInternals(_solarsystem: string, _unique: string): Promise<SiteInternals> {
	return {
		entities: [{
			type: 'facility',
			id: 'facilityStation',
		}, {
			type: 'lifeless',
			id: 'lifelessAsteroid',
		}, {
			type: 'lifeless',
			id: 'lifelessAsteroid',
		}, {
			type: 'npc',
			shiplayout: 'shiplayoutRookieShip',
		}, {
			type: 'lifeless',
			id: 'lifelessAsteroid',
		}, {
			type: 'player',
			id: 'player-dummy-0',
			shiplayout: 'shiplayoutRookieShip',
		}, {
			type: 'npc',
			shiplayout: 'shiplayoutFrigate',
		}],
	};
}

export async function getSites(_solarsystem: string): Promise<SitesNearPlanet> {
	return {
		1: [{
			kind: 'asteroidField',
			unique: 'a0-some-hex',
		}],
		2: [{
			kind: 'facilityStation',
			unique: 'station1',
			name: 'Wabinihwa I',
		}, {
			kind: 'asteroidField',
			unique: 'a1-backend',
		}, {
			kind: 'asteroidField',
			unique: 'a2-will-be',
		}],
		3: [{
			kind: 'facilityStargate',
			unique: 'system2',
			name: 'Liagi',
		}],
		4: [{
			kind: 'facilityStargate',
			unique: 'system4',
			name: 'Arama',
		}, {
			kind: 'asteroidField',
			unique: 'a3-more-creative',
		}],
	};
}
