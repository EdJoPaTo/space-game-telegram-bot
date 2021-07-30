// Types that are readonly to the game. Stuff like "how many slots does the ship have?"

import {writeFileSync} from 'fs';

export type SolarsystemIdentifier = `system${number}`;
export interface Solarsystem {
	readonly name: string;
	/** Describes the amount of granted security vs amount of loot */
	readonly security: number;

	readonly planets: number;
	/** Gates in the system and at which planet they are */
	readonly stargates: Readonly<Record<SolarsystemIdentifier, number>>;
	/**
	 * The stations and the planet location they are.
	 * Example: [1,3] -> Station 1 is at Planet 1, Station 2 is at Planet 3 */
	readonly stations: readonly number[];
}

export const SOLARSYSTEMS: Readonly<Record<string, Solarsystem>> = {
	system1: {
		name: 'Wabinihwa',
		security: 0.92,
		planets: 4,
		stargates: {
			system2: 3,
			system4: 4,
		},
		stations: [2],
	},
	system2: {
		name: 'Liagi',
		security: 1,
		planets: 7,
		stargates: {
			system1: 5,
			system3: 7,
		},
		stations: [3, 5],
	},
	system3: {
		name: 'Iramil',
		security: 0.74,
		planets: 3,
		stargates: {
			system2: 2,
			system4: 3,
		},
		stations: [2],
	},
	system4: {
		name: 'Arama',
		security: 0.51,
		planets: 2,
		stargates: {
			system1: 1,
			system3: 2,
			system5: 2,
		},
		stations: [2],
	},
	system5: {
		name: 'Plagar',
		security: 0.21,
		planets: 4,
		stargates: {
			system4: 4,
			system6: 4,
		},
		stations: [3],
	},
	system6: {
		name: 'Vosu',
		security: 0.04,
		planets: 5,
		stargates: {
			system5: 4,
		},
		stations: [3],
	},
};

createGraphviz();
function createGraphviz() {
	let text = 'digraph {\n';

	for (const [key, info] of Object.entries(SOLARSYSTEMS)) {
		text += `\t${key}[label="${info.name} (${info.security.toFixed(2)})"];\n`;
		for (const target of Object.keys(info.stargates)) {
			text += `\t${key} -> ${target};\n`;
		}
	}

	text += '}';
	writeFileSync('dist/solarsystem.graphviz', text, 'utf8');
}
