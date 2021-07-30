import {PlayerLocation, PlayerPretty} from './types/dynamic/player.js';
import {Site, SiteIdentifier} from './types/dynamic/site.js';

export async function getPlayerPretty(_playerId: unknown): Promise<PlayerPretty> {
	return {
		name: 'Bob',
	};
}

export async function getPlayerLocation(): Promise<PlayerLocation> {
	return {
		solarsystem: 'system2',
		site: 'system2-4-blaaaa',
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

export async function getSite(_identifier: SiteIdentifier): Promise<Site> {
	return {
		entities: [
			{
				type: 'facility',
				id: 'facility1',
			},
			{
				type: 'lifeless',
				id: 'lifeless1',
			},
			{
				type: 'lifeless',
				id: 'lifeless1',
			},
			{
				type: 'npc',
				shiplayout: 'shiplayout2',
			},
			{
				type: 'lifeless',
				id: 'lifeless1',
			},
			{
				type: 'player',
				id: 'asdfgasdg',
				shiplayout: 'shiplayout1',
			},
			{
				type: 'npc',
				shiplayout: 'shiplayout2',
			},
		],
	};
}
