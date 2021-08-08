import got from 'got';

import {SiteInstruction, PlayerIdentifier, PlayerLocation, Ship, SiteEntity, SitesNearPlanet, SolarsystemIdentifier, StationInstruction} from './typings.js';

const BACKEND = 'http://localhost:8080';

export async function getPlayerPretty(playerId: PlayerIdentifier): Promise<string> {
	// TODO: pretty name store
	return playerId;
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
export async function getSiteEntities(solarsystem: SolarsystemIdentifier, siteUnique: string): Promise<readonly SiteEntity[]> {
	const url = `${BACKEND}/sites/${solarsystem}/${siteUnique}`;
	return got(url).json<readonly SiteEntity[]>();
}

export async function getSites(solarsystem: SolarsystemIdentifier): Promise<SitesNearPlanet> {
	const url = `${BACKEND}/sites/${solarsystem}`;
	return got(url).json<SitesNearPlanet>();
}

export async function setSiteInstructions(playerId: PlayerIdentifier, instructions: readonly SiteInstruction[]): Promise<void> {
	const url = `${BACKEND}/player/${playerId}/site-instructions`;
	const body = JSON.stringify(instructions);
	await got.post(url, {
		headers: {'Content-Type': 'application/json'},
		body,
	});
}

export async function setStationInstructions(playerId: PlayerIdentifier, instructions: readonly StationInstruction[]): Promise<void> {
	const url = `${BACKEND}/player/${playerId}/station-instructions`;
	const body = JSON.stringify(instructions);
	await got.post(url, {
		headers: {'Content-Type': 'application/json'},
		body,
	});
}

export const FAKE_PLAYER_LOCATION_IN_SITE: PlayerLocation = {
	solarsystem: 'Wabinihwa',
	siteUnique: 'station1',
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
		id: 'station',
	}, {
		type: 'lifeless',
		id: 'asteroid',
	}, {
		type: 'lifeless',
		id: 'asteroid',
	}, {
		type: 'npc',
		faction: 'pirates',
		shiplayout: 'shiplayoutRookieShip',
	}, {
		type: 'lifeless',
		id: 'asteroid',
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
		siteUnique: 'a0-some-hex',
	}],
	2: [{
		kind: 'station',
		siteUnique: 'station1',
		name: 'Wabinihwa I',
	}, {
		kind: 'asteroidField',
		siteUnique: 'a1-backend',
	}, {
		kind: 'asteroidField',
		siteUnique: 'a2-will-be',
	}],
	3: [{
		kind: 'stargate',
		siteUnique: 'system2',
		name: 'Liagi',
	}],
	4: [{
		kind: 'stargate',
		siteUnique: 'system4',
		name: 'Arama',
	}, {
		kind: 'asteroidField',
		siteUnique: 'a3-more-creative',
	}],
};
