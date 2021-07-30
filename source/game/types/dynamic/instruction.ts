// An instruction is something a player wants to get done when the round changes into the next.
// Frontend writes and Backend executes / clears them

import {Service} from '../static/facility.js';
import {SiteIdentifier} from './site.js';

export type Instruction = ModuleSelfInstruction | ModuleTargetedInstruction | UseFacilityInstruction | WarpInstruction | UndockInstruction;

interface Targeted {
	readonly targetIdInSite: number;
}

export interface ModuleSelfInstruction {
	readonly type: 'module-self';
	readonly moduleId: number;
}

export interface ModuleTargetedInstruction extends Targeted {
	readonly type: 'module-targeted';
	readonly moduleId: number;
}

export interface UseFacilityInstruction extends Targeted {
	readonly type: 'facility';
	readonly service: Service;
}

export interface WarpInstruction {
	readonly type: 'warp';
	readonly targetSite: SiteIdentifier;
}

export interface UndockInstruction {
	readonly type: 'undock';
	readonly shipId: number;
}
