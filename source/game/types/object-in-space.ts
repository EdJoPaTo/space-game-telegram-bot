import {Coordinates, Direction} from '../position';

export interface ObjectInSpace {
	readonly coords: Coordinates;
	readonly direction: Direction | undefined;
}
