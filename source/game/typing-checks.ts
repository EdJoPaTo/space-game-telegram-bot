import {FACILITIES} from './statics.js';
import {Facility, Player} from './typings.js';

export function isPlayer(something: unknown): something is Player {
	if (typeof something !== 'object' || something === null) {
		return false;
	}

	const maybe = something as Player;
	// Good enough for now
	return typeof maybe.platform === 'string' && Boolean(maybe.id);
}

export function isFacility(something: unknown): something is Facility {
	if (typeof something !== 'string') {
		return false;
	}

	return Object.keys(FACILITIES).includes(something);
}
