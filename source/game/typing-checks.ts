import {PlayerLocation, PlayerLocationSite, PlayerLocationStation, PlayerLocationWarp} from './typings.js';

export function isLocationSite(location: PlayerLocation): location is PlayerLocationSite {
	return 'site' in location;
}

export function isLocationWarp(location: PlayerLocation): location is PlayerLocationWarp {
	return 'shipFitting' in location && !('site' in location);
}

export function isLocationStation(location: PlayerLocation): location is PlayerLocationStation {
	return 'station' in location;
}
