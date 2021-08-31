import {addSiteInstructions, getPlayerLocation, getPlayerShip, getPlayerStationAssets, setStationInstructions} from '../../game/backend.js';
import {isPlayerLocationStation, Player, PlayerLocation, PlayerStationAssets, Ship, SiteInstruction, StationInstruction} from '../../game/typings.js';

export class ContextGameProperty {
	#location: PlayerLocation;

	#currentStationAssets?: PlayerStationAssets;
	#ship?: Ship;

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

	public async getStationAssets() {
		if (!isPlayerLocationStation(this.#location)) {
			throw new Error('can only get current station assets while docked');
		}

		if (!this.#currentStationAssets) {
			const {solarsystem, station} = this.#location;
			this.#currentStationAssets = await getPlayerStationAssets(this.ownPlayerId, solarsystem, station);
		}

		return this.#currentStationAssets;
	}

	public async getShip() {
		if (!this.#ship) {
			this.#ship = await getPlayerShip(this.ownPlayerId);
		}

		return this.#ship;
	}

	public async addSiteInstructions(instructions: readonly SiteInstruction[]) {
		return addSiteInstructions(this.ownPlayerId, instructions);
	}

	public async setStationInstructions(instructions: readonly StationInstruction[]) {
		await setStationInstructions(this.ownPlayerId, instructions);
		this.#ship = undefined;
		this.#currentStationAssets = undefined;
		this.#location = await getPlayerLocation(this.ownPlayerId);
	}
}
