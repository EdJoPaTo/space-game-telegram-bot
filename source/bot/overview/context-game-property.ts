import {addSiteInstructions, getPlayerLocation, getPlayerShip, setStationInstructions} from '../../game/backend.js';
import {Player, PlayerLocation, SiteInstruction, StationInstruction} from '../../game/typings.js';

export class ContextGameProperty {
	#location: PlayerLocation;
	public get location(): PlayerLocation {
		return this.#location;
	}

	private constructor(
		public readonly ownPlayerId: Player,
		location: PlayerLocation,
	) {
		this.#location = location;
	}

	public static async generate(playerId: number) {
		const player: Player = {platform: 'telegram', id: playerId};
		const location = await getPlayerLocation(player);
		return new ContextGameProperty(player, location);
	}

	public async getShip() {
		return getPlayerShip(this.ownPlayerId);
	}

	public async addSiteInstructions(instructions: readonly SiteInstruction[]) {
		return addSiteInstructions(this.ownPlayerId, instructions);
	}

	public async setStationInstructions(instructions: readonly StationInstruction[]) {
		await setStationInstructions(this.ownPlayerId, instructions);
		this.#location = await getPlayerLocation(this.ownPlayerId);
	}
}
