import {KeyValueInMemoryFiles} from '@edjopato/datastore';

import {Player, Ship, WeaponInSpace} from './types';

const BASE_PATH = 'persist/gamestate/';

export const ships = new KeyValueInMemoryFiles<Ship>(BASE_PATH + 'ship');
export const weapons = new KeyValueInMemoryFiles<WeaponInSpace>(BASE_PATH + 'weapon');
export const player = new KeyValueInMemoryFiles<Player>(BASE_PATH + 'player');
