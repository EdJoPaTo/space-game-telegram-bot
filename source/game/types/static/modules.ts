
interface ModuleBase {
	readonly requiredCpu: number;
	readonly requiredPowergrid: number;
}

export type ModulePassiveIdentifier = `modp${number}`;
export interface ModulePassive extends ModuleBase {
	readonly capacitor?: number;
	readonly hitpointsArmor?: number;
}

interface ModuleActive extends ModuleBase {
	readonly energyConsumption: number;
}

export type ModuleSelfIdentifier = `mods${number}`;
export interface ModuleSelf extends ModuleActive {
	readonly armorRepair?: number;
}

export type ModuleTargetedIdentifier = `modt${number}`;
export interface ModuleTargeted extends ModuleActive {
	readonly amountMined?: number;
	readonly damage?: number;
}

export const MODULE_PASSIVE: Readonly<Record<string, ModulePassive>> = {
	modp1: {
		// Rookie Armor Plate
		requiredCpu: 0,
		requiredPowergrid: 10,
		hitpointsArmor: 10,
	},
};

export const MODULE_TARGETED: Readonly<Record<string, ModuleTargeted>> = {
	modt1: {
		// Rookie Mining Laser
		requiredCpu: 10,
		requiredPowergrid: 15,
		energyConsumption: 5,
		amountMined: 5,
	},
	modt2: {
		// Rookie Laser
		requiredCpu: 10,
		requiredPowergrid: 15,
		energyConsumption: 5,
		damage: 10,
	},
};

export const MODULE_SELF: Readonly<Record<string, ModuleSelf>> = {
	mods1: {
		// Rookie Armor Repair
		requiredCpu: 5,
		requiredPowergrid: 15,
		energyConsumption: 5,
		armorRepair: 5,
	},
};
