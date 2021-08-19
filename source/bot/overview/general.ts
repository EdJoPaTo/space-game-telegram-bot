import {getPlayerLocation, getPlayerShip} from '../../game/backend.js';
import {Player} from '../../game/typings.js';

export type MinimalIdentifierContext = {from?: {id?: number}};

export function getOwnIdentifier(ctx: MinimalIdentifierContext): Player {
	const id = ctx.from?.id;
	if (!id) {
		throw new Error('only works when from is defined');
	}

	return {platform: 'telegram', id};
}

export async function getOwnLocation(ctx: MinimalIdentifierContext) {
	const ownPlayerId = getOwnIdentifier(ctx);
	return getPlayerLocation(ownPlayerId);
}

export async function getOwnShip(ctx: MinimalIdentifierContext) {
	const ownPlayerId = getOwnIdentifier(ctx);
	return getPlayerShip(ownPlayerId);
}
