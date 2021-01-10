export type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

export interface Coordinates {
	readonly x: number;
	readonly y: number;
}

export function distanceBetween(a: Coordinates, b: Coordinates): number {
	const x = a.x - b.x;
	const y = a.y - b.y;
	const belowRoot = (x ** 2) + (y ** 2);
	const sqrt = Math.sqrt(belowRoot);
	return sqrt;
}

export function applyDirectionalMove(start: Coordinates, direction: Direction | undefined): Coordinates {
	if (!direction) {
		return start;
	}

	let {x, y} = start;

	if (direction.includes('N')) {
		y += 1;
	} else if (direction.includes('S')) {
		y -= 1;
	}

	if (direction.includes('E')) {
		x += 1;
	} else if (direction.includes('W')) {
		x -= 1;
	}

	return {x, y};
}
