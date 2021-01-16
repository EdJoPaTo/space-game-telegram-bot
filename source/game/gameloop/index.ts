import {scheduleJob} from 'node-schedule';

import {applyDirectionalMove, isFarOut, sameCoordinates} from '../position';
import {MINIMUM_WEAPON_DAMAGE_POTENTIAL} from '../types';
import {Module, ModuleName, Storage} from '../types/ship';
import {ships, weapons} from '../entities';

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
	// TODO: add notification output.
	// Players get notifications based on some things happening (weapon hit something, got hit by something, miner produces …, …)
	// This can be another read only array for the bot.
	// Only state here would be "read notifications until i 42"

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

	// Movement of Players / Weapons in Space
	for (const shipKey of ships.keys()) {
		const ship = ships.get(shipKey)!;
		let coords = applyDirectionalMove(ship.coords, ship.direction);
		if (isFarOut(coords)) {
			// TODO: find a better solution than resetting positions
			coords = {x: 0, y: 0};
		}

		// eslint-disable-next-line no-await-in-loop
		await ships.set(shipKey, {...ship, coords});
	}

	for (const weaponKey of weapons.keys()) {
		const weapon = weapons.get(weaponKey)!;
		const coords = applyDirectionalMove(weapon.coords, weapon.direction);
		const farOut = isFarOut(coords);

		let {damagePotential} = weapon;
		if ('lossPerDistance' in weapon) {
			damagePotential *= weapon.lossPerDistance;
		}

		const lowPotential = damagePotential < MINIMUM_WEAPON_DAMAGE_POTENTIAL;

		if (farOut || lowPotential) {
			weapons.delete(weaponKey);
		} else {
			// eslint-disable-next-line no-await-in-loop
			await weapons.set(weaponKey, {...weapon, coords, damagePotential});
		}
	}

	// Damage calculation of weapons
	for (const weaponKey of weapons.keys()) {
		const weapon = weapons.get(weaponKey)!;

		let hitAnything = false;

		const shipsOnPosition = ships.keys()
			.filter(o => sameCoordinates(ships.get(o)!.coords, weapon.coords));
		for (const shipKey of shipsOnPosition) {
			const ship = ships.get(shipKey)!;

			const modules = ship.modules
				.filter(() => Math.random() > weapon.damagePotential);

			if (modules.length < ship.modules.length) {
				hitAnything = true;

				// eslint-disable-next-line no-await-in-loop
				await ships.set(shipKey, {...ship, modules});
			}
		}

		if (hitAnything) {
			weapons.delete(weaponKey);
		}
	}

	// Produce stuff from 3D Printers
	// TODO: Not possible yet as the state and actions are not seperated yet
}

function replaceModules(allModules: readonly Module[], module: ModuleName, newModulesOfType: readonly Module[]): Module[] {
	const remaining = allModules.filter(o => o.module !== module);
	return [...remaining, ...newModulesOfType];
}
