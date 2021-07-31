// An instruction is something a player wants to get done when the round changes into the next.
// Frontend writes and Backend executes / clears them.
// Some actions might take multiple rounds (start warp, speed up, …) which requires the frontend to read the instructions again after each round.
// They are written and read by both frontend and backend!

import {Service} from '../static/facility.js';

export type Instruction = ModuleSelfInstruction | ModuleTargetedInstruction | UseFacilityInstruction | WarpInstruction | UndockInstruction;

interface Targeted {
	readonly targetIndexInSite: number;
}

export interface ModuleSelfInstruction {
	readonly type: 'module-self';
	readonly moduleIndex: number;
}

export interface ModuleTargetedInstruction extends Targeted {
	readonly type: 'module-targeted';
	readonly moduleIndex: number;
}

export interface UseFacilityInstruction extends Targeted {
	readonly type: 'facility';
	readonly service: Service;
}

export interface WarpInstruction {
	readonly type: 'warp';
	readonly siteUnique: string;
}

export interface UndockInstruction {
	readonly type: 'undock';
	readonly shipId: number;
}
