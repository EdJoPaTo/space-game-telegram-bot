import {PlayerLocation, PlayerLocationStation, PlayerLocationWarp, PlayerLocationSite} from './typings.js';

export function isLocationSite(location: PlayerLocation): location is PlayerLocationSite {
	return 'site' in location;
}

export function isLocationWarp(location: PlayerLocation): location is PlayerLocationWarp {
	return !isLocationSite(location) && !isLocationStation(location);
}

export function isLocationStation(location: PlayerLocation): location is PlayerLocationStation {
	return 'station' in location;
}
