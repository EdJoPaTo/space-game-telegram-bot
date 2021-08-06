import {PlayerLocation, PlayerLocationStation, PlayerLocationWarp, SiteIdentifier} from './typings.js';

export function isLocationSite(location: PlayerLocation): location is SiteIdentifier {
	return 'siteUnique' in location;
}

export function isLocationWarp(location: PlayerLocation): location is PlayerLocationWarp {
	return 'towardsSiteUnique' in location;
}

export function isLocationStation(location: PlayerLocation): location is PlayerLocationStation {
	return 'station' in location;
}
