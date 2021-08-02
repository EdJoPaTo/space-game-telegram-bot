import got from 'got';

import {PlayerIdentifier, PlayerLocation, SiteInners, SitesNearPlanet} from './typings.js';

const BACKEND = 'http://localhost:8080/';

export async function getPlayerPretty(playerId: string) {
	const name = playerId.includes('tg') ? 'You' : 'Bob';
	return {name};
}

export async function getPlayerLocation(playerId: PlayerIdentifier): Promise<PlayerLocation> {
	const url = `${BACKEND}player-location/${playerId}`;
	return got(url).json<PlayerLocation>();
}

/** Get information which is only visible from within the site */
export async function getSiteInners(solarsystem: string, unique: string): Promise<SiteInners> {
	const url = `${BACKEND}site-inners/${solarsystem}/${unique}`;
	return got(url).json<SiteInners>();
}

export async function getSites(solarsystem: string): Promise<SitesNearPlanet> {
	const url = `${BACKEND}sites/${solarsystem}`;
	return got(url).json<SitesNearPlanet>();
}

export const FAKE_PLAYER_LOCATION_IN_SITE: PlayerLocation = {
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

export const FAKE_SITE_INNERS: SiteInners = {
	entities: [
		{
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
		},
	],
};

export const FAKE_SITES_NEAR_PLANET: SitesNearPlanet = {
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
