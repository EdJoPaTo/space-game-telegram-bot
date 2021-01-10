import {ObjectInSpace} from './object-in-space';

export type UnixTimestamp = number;

export interface Ship extends ObjectInSpace {
	readonly playerId: string;
	readonly lastMovement: UnixTimestamp;
	readonly modules: readonly Module[];
}

export type Module =
	Engine |
	Storage |
	Miner |
	Printer |
	PointDefenseCannon |
	Railgun |
	MissileBay;

export type ModuleName = Module['module'];
export const MODULES: readonly ModuleName[] = [
	'Engine',
	'Storage',
	'Miner',
	'Printer',
	'PointDefenseCannon',
	'Railgun',
	'MissileBay'
];

export interface Engine {
	readonly module: 'Engine';
}

export interface Storage {
	readonly module: 'Storage';
	readonly storedMass: number;
}

export interface Miner {
	readonly module: 'Miner';
}

export interface Printer {
	readonly module: 'Printer';
}

export interface PointDefenseCannon {
	readonly module: 'PointDefenseCannon';
	readonly projectiles: number;
}

export interface Railgun {
	readonly module: 'Railgun';
	readonly slugs: number;
}

export interface MissileBay {
	readonly module: 'MissileBay';
	readonly missiles: number;
}
