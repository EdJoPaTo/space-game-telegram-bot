# Space Game

[toc]

## Ship
Your Ship is like a village in Die Stämme
Build some "buildings" = modules.
Its rather "amount" than "level".
Maybe a bit like Clash of Clans? Main Building allows for more of the same buildings?

- Storage
- Miner
- 3D Printer
- Weapons
    - PDC
    - Railgun
    - Missile Bay
- Engine

## Area

Everything is on a 2D x y coordinate map.
Movement is a direction (0°, 45°, 90°, …).
Every entity on the map advances only every 5 min (tick based).

Actions get added to a list.
When the tick happens every action is done and the map/state updated.
actions are ordered:
1. firing/launching weapons (damage other players on the same coords)
2. miner
3. movement of players / weapons
4. damage calculation of weapons
5. produce stuff from 3D Printers

## Engine / Player Movement

A player can either move or not move.
If in movement the engine amount / total module amount decides to amount of ticks needed per movement.

Example: 5 Engines on 20 modules total = 0.25 movement per tick = 1 movement every 4 ticks
Moving diagonal means 1.414 movement required → ticks are rounded up → 1 movement every 6 ticks

When changing the direction (or start moving) you lose 1 mass per engine.
When there is no mass, the direction change is free.

Changing the direction resets the amount of ticks until the next movement.


## Weapons

- Weapons can be fired into a direction (0°, 45°, 90°, …)
- always moves 1 per tick (1.414 when diagonal)
- damage potential
    - should depend on target mass (big mass = easy target)
    - reduced by range (PDC & Railgun). simulates bad tracking speed, inaccuracy of produces rounds, …
- penetration chance
    - when it hits something there is a chance it can hit something else (or is destroyed)
    - when it hits something on that coordinates it ends there (does not continue to travel)
- each turret (PDC / Railgun) can fire once per round (if ammo / energy is there)
    - 2x PDC can fire 2 projectiles in one round/tick
- the missile bay stores missiles. They can be launched all at the same time

|                            | PDC      | Railgun  | Missile  |
| -------------------------- | -------- | -------- | -------- |
| distance loss              | high     | low      | none
| dmg potential (player)     | 2%       | 15%      | 5%
| dmg potential (missile)    | 30%      | 1%       | 30%
| penetration chance         | 10%      | 100%     | 80%
| firing cost (mass)         | 1        | 100      | 30
| defensive tactics          | range    | movement | PDC

### Damage

Every weapon on their way has a chance to damage every module on the coordinate.
If it damages anything it gets destroyed if it did not hit anything it continues its travel (next round).
For example a PDC Projectile has 2% chance per module to destroy it.
When someone fires a PDC which ends up on a coordinate with 10 players with each 100 modules it will probably destroy 20 modules.

## 3D Printer

The printer can print a certain amount of m³ per round / tick.
Stuff like PDC Rounds, Railgun Slugs and Missiles need to be printed.

### Goods per round/tick per level

10 Projectiles (PDC)
- 10 mass

1 Missile
- 30 mass

1 Railgun Slug
- 100 mass

### Long Term:

You can decide between speed and precision when printing something.
Precision reduces material cost per item and improves the efficency of the outcome product(s).
Speed on the other hand increases the amount of output goods per round.

Printing options (linear between?):
- +50% volume, +25% cost per item & -25% item efficiency
- no boni
- -25% volume, -10% cost per item & +50% item efficiency


## Storage

A storage unit can fit 100 mass
only if something is within the storage unit its counted for mass / movement

## Miner

When within 2 distance of an asteroid each miner can gain 10 mass


## Energy (= Premium?)

Players get 1 energy per tick (every 5min) = 12 per hour
Players can have a maximum of 100 energy.

Players can activate cloak for 50 energy (instant) followed by 0.5 Energy per Tick.
(dont generate energy for that time)

While cloaked they are not visible to other players / the map and have 1/10 the chance to be hit.
Getting hit does not decloak.
While cloaked direction change and use of weapons is not possible.
