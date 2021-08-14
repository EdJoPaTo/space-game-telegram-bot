import {PlayerLocation, PlayerLocationStation, PlayerLocationWarp, PlayerLocationSite, Player} from './typings.js';

export function isLocationSite(location: PlayerLocation): location is PlayerLocationSite {
	return 'site' in location;
}

export function isLocationWarp(location: PlayerLocation): location is PlayerLocationWarp {
	return !isLocationSite(location) && !isLocationStation(location);
}

export function isLocationStation(location: PlayerLocation): location is PlayerLocationStation {
	return 'station' in location;
}

export function isPlayer(something: unknown): something is Player {
	if (typeof something !== 'object' || something === null) {
		return false;
	}

	const maybe = something as Player;
	// Good enough for now
	return typeof maybe.platform === 'string' && Boolean(maybe.id);
}
