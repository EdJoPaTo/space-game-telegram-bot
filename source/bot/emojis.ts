const GROWING = '💗';
const BEATING = '💓'

const BASE_EMOJIS = {
	solarsystem: '🪐',
	security: '👮',
	location: '📍',
	target: '🎯',
	self: '🧘',
	stop: '🛑',
	repair: '🔧',
	undock: '🚪',

	capacitor: '🔋',
	damage: '💥',
	hitpointsArmor: '🛡',
	hitpointsStructure: '⚙',
	mine: '🪨',
	warpDisruption: '🔗',

	asteroidField: '🪨',
	stargate: '💫',
	station: '🛰️',

	pirates: '🏴‍☠️',
	guards: '👮',
};

export const EMOJIS = {
	...BASE_EMOJIS,
	armorRepair: BASE_EMOJIS.hitpointsArmor + GROWING,
	structureRepair: BASE_EMOJIS.hitpointsStructure + GROWING,
	capacitorRecharge: BASE_EMOJIS.capacitor + GROWING,
	capacitorDrain: BASE_EMOJIS.capacitor + BEATING,
};

/**
 * Uses the ceiling → 90% looks like 100%.
 *
 * ▁▂▃▄▅▆▇█
 * @param percentage percentage from 0.0 to 1.0
 * @returns its relevant block
 */
export function percentageBlock(percentage: number) {
	const parts = Math.ceil(percentage * 8);
	if (parts > 7) {
		return '█';
	}

	if (parts > 6) {
		return '▇';
	}

	if (parts > 5) {
		return '▆';
	}

	if (parts > 4) {
		return '▅';
	}

	if (parts > 3) {
		return '▄';
	}

	if (parts > 2) {
		return '▃';
	}

	if (parts > 1) {
		return '▂';
	}

	if (parts > 0) {
		return '▁';
	}

	return '';
}

/**
 * Uses the ceiling → 90% looks like 100%.
 *
 * ⅛¼⅜½⅝¾⅞
 * @param percentage percentage from 0.0 to 1.0
 * @returns its relevant block
 */
export function percentageFraction(percentage: number) {
	const parts = Math.ceil(percentage * 8);
	if (parts > 7) {
		return '';
	}

	if (parts > 6) {
		return '⅞';
	}

	if (parts > 5) {
		return '¾';
	}

	if (parts > 4) {
		return '⅝';
	}

	if (parts > 3) {
		return '½';
	}

	if (parts > 2) {
		return '⅜';
	}

	if (parts > 1) {
		return '¼';
	}

	if (parts > 0) {
		return '⅛';
	}

	return '';
}
