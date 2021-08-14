import got from 'got';

import {SiteInstruction, Player, PlayerLocation, Ship, SiteEntity, SitesNearPlanet, Solarsystem, StationInstruction} from './typings.js';

const BACKEND = 'http://localhost:8080';

export async function getPlayerPretty(player: Player): Promise<string> {
	// TODO: pretty name store
	return `${player.platform}-${player.id}`;
}

export async function getPlayerLocation(player: Player): Promise<PlayerLocation> {
	const url = `${BACKEND}/player/${player.platform}-${player.id}/location`;
	return got(url).json<PlayerLocation>();
}

export async function getPlayerShip(player: Player): Promise<Ship> {
	const url = `${BACKEND}/player/${player.platform}-${player.id}/ship`;
	return got(url).json<Ship>();
}

/** Get information which is only visible from within the site */
export async function getSiteEntities(solarsystem: Solarsystem, siteUnique: string): Promise<readonly SiteEntity[]> {
	const url = `${BACKEND}/sites/${solarsystem}/${siteUnique}`;
	return got(url).json<readonly SiteEntity[]>();
}

export async function getSites(solarsystem: Solarsystem): Promise<SitesNearPlanet> {
	const url = `${BACKEND}/sites/${solarsystem}`;
	return got(url).json<SitesNearPlanet>();
}

export async function setSiteInstructions(player: Player, instructions: readonly SiteInstruction[]): Promise<void> {
	const url = `${BACKEND}/player/${player.platform}-${player.id}/site-instructions`;
	const body = JSON.stringify(instructions);
	await got.post(url, {
		headers: {'Content-Type': 'application/json'},
		body,
	});
}

export async function setStationInstructions(player: Player, instructions: readonly StationInstruction[]): Promise<void> {
	const url = `${BACKEND}/player/${player.platform}-${player.id}/station-instructions`;
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
		layout: 'Abis',
		slotsTargeted: ['rookieMiner', 'rookieLaser'],
		slotsUntargeted: ['rookieArmorRepair'],
		slotsPassive: ['rookieArmorPlate'],
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
		armor: 0.2,
		structure: 0.6,
	}, {
		type: 'lifeless',
		id: 'asteroid',
		armor: 0.2,
		structure: 0.6,
	}, {
		type: 'npc',
		faction: 'pirates',
		shiplayout: 'Abis',
		armor: 0.2,
		structure: 0.6,
	}, {
		type: 'lifeless',
		id: 'asteroid',
		armor: 0.2,
		structure: 0.6,
	}, {
		type: 'player',
		id: {platform: 'telegram', id: 666},
		shiplayout: 'Abis',
		armor: 0.2,
		structure: 0.6,
	}, {
		type: 'npc',
		faction: 'guards',
		shiplayout: 'Hecate',
		armor: 0.2,
		structure: 0.6,
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
