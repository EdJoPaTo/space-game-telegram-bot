import {PlayerLocation} from './types/dynamic/player.js';

export async function getPlayerlocation(): Promise<PlayerLocation> {
	return {
		solarsystem: 'system2',
		site: 'blaaaa',
		shipFitting: {
			layout: 'shipl1',
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
