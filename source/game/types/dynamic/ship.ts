import {ModulePassiveIdentifier, ModuleSelfIdentifier, ModuleTargetedIdentifier} from '../static/modules.js';
import {ShipLayoutIdentifier} from '../static/shiplayout.js';

export interface ShipFitting {
	readonly layout: ShipLayoutIdentifier;

	readonly slotsTargeted: readonly ModuleTargetedIdentifier[];
	readonly slotsSelf: readonly ModuleSelfIdentifier[];
	readonly slotsPassive: readonly ModulePassiveIdentifier[];
}

/**
 * The current situation of a ship.
 * The fitting describes the total / max amounts.
 **/
export interface ShipStatus {
	readonly capacitor: number;
	readonly armor: number;
	readonly structure: number;
}
