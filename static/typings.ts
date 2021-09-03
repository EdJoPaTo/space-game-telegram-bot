/**
 * Space game typings
 * by EdJoPaTo
 * AGPL-3.0-or-later
 * https://github.com/EdJoPaTo/space-game-typings
 */

export function isSiteEntityAsteroid(
  entity: SiteEntity,
): entity is SiteEntityAsteroid {
  return "ore" in entity;
}
export function isSiteEntityFacility(
  entity: SiteEntity,
): entity is SiteEntityFacility {
  return "facility" in entity;
}
export function isSiteEntityNpc(entity: SiteEntity): entity is SiteEntityNpc {
  return "faction" in entity;
}
export function isSiteEntityPlayer(
  entity: SiteEntity,
): entity is SiteEntityPlayer {
  return "player" in entity;
}

export function isPlayerLocationSite(
  location: PlayerLocation,
): location is PlayerLocationSite {
  return "site" in location;
}
export function isPlayerLocationStation(
  location: PlayerLocation,
): location is PlayerLocationStation {
  return "station" in location;
}
export function isPlayerLocationWarp(
  location: PlayerLocation,
): location is PlayerLocationWarp {
  return "towards" in location;
}

/* Autogenerated after here */

export interface Collateral {
  readonly structure: number;
  readonly armor: number;
  readonly capacitor: number;
}
export interface Health {
  readonly armor: number;
  readonly structure: number;
}
export type Service = "dock" | "jump";
export interface FacilityDetails {
  readonly services: readonly Service[];
}
export type Facility = "station" | "stargate";
export type ItemCategory = "mineral" | "module" | "ore" | "ship";
export interface ItemDetails {
  readonly category: ItemCategory;
  readonly recycle: Readonly<Partial<Record<Mineral, number>>>;
}
export type Mineral = "Derite" | "Fylite" | "Ragite";
export type Ore = "Aromit" | "Solmit" | "Tormit" | "Vesmit";
export type Item = Mineral | Module | Ore;
export interface Order {
  readonly date: `${number}-${number}-${number}T${number}:${number}:${number}${string}Z`;
  readonly solarsystem: Solarsystem;
  readonly station: number;
  readonly trader: Trader;
  readonly amount: number;
  readonly paperclips: number;
}
export interface Trade {
  readonly solarsystem: Solarsystem;
  readonly station: number;
  readonly buyer: Trader;
  readonly seller: Trader;
  readonly amount: number;
  readonly paperclips: number;
}
export type Trader = NpcFaction | Player;
export interface ItemMarket {
  readonly buy: readonly Order[];
  readonly sell: readonly Order[];
}
export type ModulePassive = "rookieArmorPlate";
export interface ModulePassiveDetails {
  readonly requiredCpu: number;
  readonly requiredPowergrid: number;
  readonly hitpointsArmor: number;
}
export type ModuleTargeted = "guardianLaser" | "rookieLaser" | "rookieMiner";
export interface ModuleTargetedDetails {
  readonly requiredCpu: number;
  readonly requiredPowergrid: number;
  readonly effectsOrigin: readonly RoundEffect[];
  readonly effectsTarget: readonly RoundEffect[];
}
export type ModuleUntargeted = "rookieArmorRepair";
export interface ModuleUntargetedDetails {
  readonly requiredCpu: number;
  readonly requiredPowergrid: number;
  readonly effects: readonly RoundEffect[];
}
export type Module = ModulePassive | ModuleTargeted | ModuleUntargeted;
export type NpcFaction = "guards" | "pirates";
export interface PlayerLocationSite {
  readonly solarsystem: Solarsystem;
  readonly site: Site;
}
export interface PlayerLocationStation {
  readonly solarsystem: Solarsystem;
  readonly station: number;
}
export interface PlayerLocationWarp {
  readonly solarsystem: Solarsystem;
  readonly towards: Site;
}
export type PlayerLocation =
  | PlayerLocationSite
  | PlayerLocationStation
  | PlayerLocationWarp;
export interface PlayerGeneral {
  readonly homeSolarsystem: Solarsystem;
  readonly homeStation: number;
  readonly paperclips: number;
}
export interface PlayerNotifications {
  readonly siteLog: readonly SiteLog[];
  readonly trades: readonly [Item, Trade][];
}
export interface PlayerStationAssets {
  readonly currentShip?: Ship;
  readonly ships: readonly Ship[];
  readonly storage: Storage;
}
export type Player = { platform: "telegram"; id: number };
export type RoundEffect =
  | { type: "capacitorDrain"; amount: number }
  | { type: "capacitorRecharge"; amount: number }
  | { type: "armorRepair"; amount: number }
  | { type: "structureRepair"; amount: number }
  | { type: "damage"; amount: number }
  | { type: "mine"; amount: number }
  | { type: "warpDisruption"; amount?: null };
export type ShipClass = "rookieShip" | "frigate" | "cruiser" | "battleship";
export interface ShipLayoutDetails {
  readonly class: ShipClass;
  readonly cpu: number;
  readonly powergrid: number;
  readonly slotsTargeted: number;
  readonly slotsUntargeted: number;
  readonly slotsPassive: number;
  readonly cargoSlots: number;
  readonly structure: number;
  readonly armor: number;
  readonly capacitor: number;
  readonly roundEffects: readonly RoundEffect[];
}
export type ShipLayout = "Paladin" | "Abis" | "Hecate";
export interface ShipFitting {
  readonly layout: ShipLayout;
  readonly slotsTargeted: readonly ModuleTargeted[];
  readonly slotsUntargeted: readonly ModuleUntargeted[];
  readonly slotsPassive: readonly ModulePassive[];
}
export interface ShipFittingInfrastructureUsage {
  readonly cpu: number;
  readonly powergrid: number;
  readonly slotsPassive: number;
  readonly slotsTargeted: number;
  readonly slotsUntargeted: number;
}
export interface Ship {
  readonly fitting: ShipFitting;
  readonly collateral: Collateral;
  readonly cargo: Storage;
}
export interface SiteEntityAsteroid {
  readonly ore: Ore;
  readonly armor: number;
  readonly structure: number;
}
export interface SiteEntityFacility {
  readonly facility: Facility;
}
export interface SiteEntityNpc {
  readonly faction: NpcFaction;
  readonly shiplayout: ShipLayout;
  readonly armor: number;
  readonly structure: number;
}
export interface SiteEntityPlayer {
  readonly player: Player;
  readonly shiplayout: ShipLayout;
  readonly armor: number;
  readonly structure: number;
}
export type SiteEntity =
  | SiteEntityAsteroid
  | SiteEntityFacility
  | SiteEntityNpc
  | SiteEntityPlayer;
export interface SiteInstructionFacility {
  readonly targetIndexInSite: number;
  readonly service: Service;
}
export interface SiteInstructionModuleTargeted {
  readonly targetIndexInSite: number;
  readonly moduleIndex: number;
}
export interface SiteInstructionModuleUntargeted {
  readonly moduleIndex: number;
}
export interface SiteInstructionWarp {
  readonly target: Site;
}
export type SiteInstruction =
  | { type: "moduleUntargeted"; args: SiteInstructionModuleUntargeted }
  | { type: "moduleTargeted"; args: SiteInstructionModuleTargeted }
  | { type: "selfDestruct"; args?: null }
  | { type: "facility"; args: SiteInstructionFacility }
  | { type: "warp"; args: SiteInstructionWarp };
export type SiteLogActor = Ore | Facility | [NpcFaction, ShipLayout] | [
  Player,
  ShipLayout,
];
export type SiteLog =
  | {
    type: "moduleTargeted";
    details: [SiteLogActor, ModuleTargeted, SiteLogActor];
  }
  | { type: "collapse"; details: SiteLogActor }
  | { type: "jump"; details: SiteLogActor }
  | { type: "rapidUnscheduledDisassembly"; details: SiteLogActor }
  | { type: "dock"; details: SiteLogActor }
  | { type: "undock"; details: SiteLogActor }
  | { type: "warpIn"; details: SiteLogActor }
  | { type: "warpOut"; details: SiteLogActor };
export type SitesNearPlanet = Readonly<Partial<Record<number, Site[]>>>;
export type Site = { kind: "station"; unique: number } | {
  readonly kind: "stargate";
  readonly unique: Solarsystem;
} | { kind: "asteroidField"; unique: number };
export interface SolarsystemDetails {
  readonly security: number;
  readonly planets: number;
  readonly stargates: Readonly<Partial<Record<Solarsystem, number>>>;
  readonly stations: readonly number[];
}
export type Solarsystem =
  | "Wabinihwa"
  | "Arama"
  | "Iramil"
  | "Liagi"
  | "Plagar"
  | "Vosu";
export interface PlaceOrder {
  readonly item: Item;
  readonly amount: number;
  readonly paperclips: number;
}
export interface TransferItems {
  readonly item: Item;
  readonly amount: number;
}
export type StationInstruction =
  | { type: "switchShip"; args: number }
  | { type: "repair"; args?: null }
  | { type: "undock"; args?: null }
  | { type: "moduleAdd"; args: Module }
  | { type: "modulePassiveRemove"; args: number }
  | { type: "moduleTargetedRemove"; args: number }
  | { type: "moduleUntargetedRemove"; args: number }
  | { type: "shipCargoLoad"; args: TransferItems }
  | { type: "shipCargoUnload"; args: TransferItems }
  | { type: "buy"; args: PlaceOrder }
  | { type: "sell"; args: PlaceOrder }
  | {
    type: "recycle";
    args: {
      item: Item;
      amount: number;
    };
  };
export type Storage = Readonly<Partial<Record<Item, number>>>;
