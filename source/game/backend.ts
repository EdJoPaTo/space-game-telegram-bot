import got from 'got';

import {SiteInstruction, Player, PlayerLocation, Ship, SiteEntity, SitesNearPlanet, Solarsystem, StationInstruction, Site, SiteLog, ShipLayout, NpcFaction, PlayerGeneral, ItemMarket, Item, PlayerStationAssets, PlayerNotifications} from './typings.js';

const BACKEND = 'http://localhost:8080';

export async function getPlayerPretty(player: Player): Promise<string> {
	// TODO: pretty name store
	return `${player.platform}-${player.id}`;
}

export async function getPlayerGenerals(player: Player): Promise<PlayerGeneral> {
	const url = `${BACKEND}/player/${player.platform}-${player.id}/generals`;
	return got(url).json<PlayerGeneral>();
}

export async function getPlayerStationAssets(player: Player, solarsystem: Solarsystem, station: number): Promise<PlayerStationAssets> {
	const url = `${BACKEND}/player/${player.platform}-${player.id}/station-assets/${solarsystem}/${station}`;
	return got(url).json<PlayerStationAssets>();
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
export async function getSiteEntities(solarsystem: Solarsystem, site: Site): Promise<readonly SiteEntity[]> {
	const url = `${BACKEND}/sites/${solarsystem}/${site.kind}-${site.unique}`;
	return got(url).json<readonly SiteEntity[]>();
}

export async function getSites(solarsystem: Solarsystem): Promise<SitesNearPlanet> {
	const url = `${BACKEND}/sites/${solarsystem}`;
	return got(url).json<SitesNearPlanet>();
}

export async function getSiteInstructions(player: Player): Promise<SiteInstruction[]> {
	const url = `${BACKEND}/player/${player.platform}-${player.id}/site-instructions`;
	return got(url).json<SiteInstruction[]>();
}

export async function addSiteInstructions(player: Player, instructions: readonly SiteInstruction[]): Promise<void> {
	const url = `${BACKEND}/player/${player.platform}-${player.id}/site-instructions`;
	const body = JSON.stringify(instructions);
	await got.post(url, {
		headers: {'Content-Type': 'application/json'},
		body,
	});
}

export async function getNotifications(player: Player): Promise<PlayerNotifications> {
	const url = `${BACKEND}/player/${player.platform}-${player.id}/notifications`;
	return got(url).json<PlayerNotifications>();
}

export async function getPlayersWithNotifications(): Promise<Player[]> {
	const url = `${BACKEND}/platform/telegram/notification-players`;
	return got(url).json<Player[]>();
}

export async function setStationInstructions(player: Player, instructions: readonly StationInstruction[]): Promise<void> {
	const url = `${BACKEND}/player/${player.platform}-${player.id}/station-instructions`;
	const body = JSON.stringify(instructions);
	await got.post(url, {
		headers: {'Content-Type': 'application/json'},
		body,
	});
}

export async function getItemMarket(item: Item): Promise<ItemMarket> {
	const url = `${BACKEND}/market/${item}`;
	return got(url).json<ItemMarket>();
}

export const FAKE_PLAYER_LOCATION_IN_SITE: PlayerLocation = {
	solarsystem: 'Wabinihwa',
	site: {kind: 'station', unique: 1},
};

export const FAKE_SHIP: Ship = {
	fitting: {
		layout: 'Abis',
		slotsTargeted: ['rookieMiner', 'rookieLaser'],
		slotsUntargeted: ['rookieArmorRepair'],
		slotsPassive: ['rookieArmorPlate'],
	},
	collateral: {
		capacitor: 40,
		armor: 20,
		structure: 10,
	},
	cargo: {
		Aromit: 2,
	},
};

export const FAKE_SITE_INNERS: readonly SiteEntity[] = [
	{
		facility: 'station',
	}, {
		ore: 'Aromit',
		armor: 0.2,
		structure: 0.6,
	}, {
		ore: 'Solmit',
		armor: 0.2,
		structure: 0.6,
	}, {
		faction: 'pirates',
		shiplayout: 'Abis',
		armor: 0.2,
		structure: 0.6,
	}, {
		ore: 'Tormit',
		armor: 0.2,
		structure: 0.6,
	}, {
		player: {platform: 'telegram', id: 666},
		shiplayout: 'Abis',
		armor: 0.2,
		structure: 0.6,
	}, {
		faction: 'guards',
		shiplayout: 'Hecate',
		armor: 0.2,
		structure: 0.6,
	},
];

export const FAKE_SITES_NEAR_PLANET: SitesNearPlanet = {
	1: [{
		kind: 'asteroidField',
		unique: 42,
	}],
	2: [{
		kind: 'station',
		unique: 1,
	}, {
		kind: 'asteroidField',
		unique: 43,
	}, {
		kind: 'asteroidField',
		unique: 44,
	}],
	3: [{
		kind: 'stargate',
		unique: 'Liagi',
	}],
	4: [{
		kind: 'stargate',
		unique: 'Arama',
	}, {
		kind: 'asteroidField',
		unique: 45,
	}],
};

export const FAKE_SITE_LOG: SiteLog[] = [
	{
		type: 'dock',
		details: [{
			platform: 'telegram',
			id: 666,
		}, 'Hecate'],
	},
	{
		type: 'undock',
		details: [{
			platform: 'telegram',
			id: 1337,
		}, 'Abis'],
	},
	{
		type: 'rapidUnscheduledDisassembly',
		details: ['pirates', 'Hecate'] as [NpcFaction, ShipLayout],
	},
	{
		type: 'rapidUnscheduledDisassembly',
		details: [{
			platform: 'telegram',
			id: 42,
		}, 'Abis'],
	},
	{
		type: 'moduleTargeted',
		details: [
			[{platform: 'telegram', id: 666}, 'Abis'],
			'rookieLaser',
			['pirates', 'Hecate'] as [NpcFaction, ShipLayout],
		],
	},
];

export const FAKE_ITEM_MARKET: ItemMarket = {
	buy: [{
		date: '1997-12-19T08:14:32Z',
		solarsystem: 'Wabinihwa',
		station: 0,
		trader: 'guards',
		amount: 42,
		paperclips: 42,
	}],
	sell: [{
		date: '1998-12-19T15:00:00Z',
		solarsystem: 'Wabinihwa',
		station: 1,
		trader: 'guards',
		amount: 666,
		paperclips: 42,
	}, {
		date: '1998-12-19T15:00:00Z',
		solarsystem: 'Wabinihwa',
		station: 0,
		trader: 'pirates',
		amount: 42,
		paperclips: 666,
	}, {
		date: '2012-12-19T15:00:00Z',
		solarsystem: 'Arama',
		station: 0,
		trader: 'pirates',
		amount: 1337,
		paperclips: 666,
	}, {
		date: '1998-12-19T15:00:00Z',
		solarsystem: 'Wabinihwa',
		station: 0,
		trader: 'guards',
		amount: 42,
		paperclips: 1337,
	}, {
		date: '1998-12-19T15:00:00Z',
		solarsystem: 'Wabinihwa',
		station: 2,
		trader: 'guards',
		amount: 13,
		paperclips: 421_337,
	}, {
		date: '1998-12-19T15:00:00Z',
		solarsystem: 'Wabinihwa',
		station: 0,
		trader: 'guards',
		amount: 1,
		paperclips: 10_000_000,
	}],
};
