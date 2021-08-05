import got from 'got';

import {Instruction, PlayerIdentifier, PlayerLocation, Ship, SiteEntity, SitesNearPlanet} from './typings.js';

const BACKEND = 'http://localhost:8080';

export async function getPlayerPretty(playerId: string) {
	const name = playerId.includes('tg') ? 'You' : 'Bob';
	return {name};
}

export async function getPlayerLocation(playerId: PlayerIdentifier): Promise<PlayerLocation> {
	const url = `${BACKEND}/player/${playerId}/location`;
	return got(url).json<PlayerLocation>();
}

export async function getPlayerShip(playerId: PlayerIdentifier): Promise<Ship> {
	const url = `${BACKEND}/player/${playerId}/ship`;
	return got(url).json<Ship>();
}

/** Get information which is only visible from within the site */
export async function getSiteEntities(solarsystem: string, unique: string): Promise<readonly SiteEntity[]> {
	const url = `${BACKEND}/sites/${solarsystem}/${unique}`;
	return got(url).json<readonly SiteEntity[]>();
}

export async function getSites(solarsystem: string): Promise<SitesNearPlanet> {
	const url = `${BACKEND}/sites/${solarsystem}`;
	return got(url).json<SitesNearPlanet>();
}

export async function setInstructions(playerId: PlayerIdentifier, instructions: readonly Instruction[]): Promise<void> {
	const url = `${BACKEND}/set-instructions/${playerId}`;
	const body = JSON.stringify(instructions);
	const response = await got.post(url, {
		headers: {
			'Content-Type': 'application/json',
		},
		body,
	});
	if (response.statusCode !== 200) {
		throw new Error('not successful');
	}
}

export const FAKE_PLAYER_LOCATION_IN_SITE: PlayerLocation = {
	solarsystem: 'system1',
	site: {
		kind: 'facilityStation',
		unique: 'station1',
		name: 'Wabinihwa I',
	},
};

export const FAKE_SHIP: Ship = {
	fitting: {
		layout: 'shiplayoutRookieShip',
		slotsTargeted: ['modtRookieMiningLaser', 'modtRookieLaser'],
		slotsUntargeted: ['moduRookieArmorRepair'],
		slotsPassive: ['modpRookieArmorPlate'],
	},
	status: {
		capacitor: 40,
		hitpointsArmor: 20,
		hitpointsStructure: 10,
	},
};

export const FAKE_SITE_INNERS: readonly SiteEntity[] = [
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
		faction: 'pirates',
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
		faction: 'guards',
		shiplayout: 'shiplayoutFrigate',
	},
];

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
