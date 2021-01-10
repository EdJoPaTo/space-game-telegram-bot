import {scheduleJob} from 'node-schedule';
import {ships} from '../entities';
import {Module, ModuleName, Storage} from '../types/ship';

export function start(): void {
	scheduleJob('*/5 * * * *', async () => {
		try {
			await iterateOnce();
		} catch (error: unknown) {
			console.error('gameloop ERROR', error);
		}
	});
}

async function iterateOnce(): Promise<void> {
	// Fire weapons (and damage ships on same position)
	// TODO: Not possible yet as the state and actions are not seperated yet

	// Collect stuff from miners into storage
	for (const shipKey of ships.keys()) {
		const ship = ships.get(shipKey)!;
		const miners = ship.modules.filter(o => o.module === 'Miner').length;
		let addMass = miners * 10;

		const storageModules = ship.modules.filter(o => o.module === 'Storage') as readonly Storage[];
		const newStorageModules: Storage[] = [];
		for (const module of storageModules) {
			const current = module.storedMass;
			const free = 100 - current;
			const add = Math.min(free, addMass);

			addMass -= add;
			newStorageModules.push({
				module: 'Storage',
				storedMass: current + add
			});
		}

		const newModules = replaceModules(ship.modules, 'Storage', newStorageModules);
		// eslint-disable-next-line no-await-in-loop
		await ships.set(shipKey, {...ship, modules: newModules});
	}

	// TODO: Movement of Players / Weapons in Space

	// TODO: Damage calculation of weapons

	// Produce stuff from 3D Printers
	// TODO: Not possible yet as the state and actions are not seperated yet
}

function replaceModules(allModules: readonly Module[], module: ModuleName, newModulesOfType: readonly Module[]): Module[] {
	const remaining = allModules.filter(o => o.module !== module);
	return [...remaining, ...newModulesOfType];
}
