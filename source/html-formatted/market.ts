import {html as format} from 'telegram-format';

import {isPlayerLocationStation, Item, ItemMarket, Order, PlayerLocation, Trade} from '../game/typings.js';

import {EMOJIS} from './emojis.js';
import {formatStation} from './location.js';

export function itemMarketPart(market: ItemMarket, currentLocation: PlayerLocation, filterSameStation: boolean) {
	let text = '';
	text += format.bold(EMOJIS.add + 'Buy from others');
	text += '\n';
	text += ordersPart(market.sell, currentLocation, filterSameStation);
	text += '\n\n';
	text += format.bold(EMOJIS.remove + 'Sell to others');
	text += '\n';
	text += ordersPart(market.buy, currentLocation, filterSameStation);
	return text;
}

function ordersPart(orders: readonly Order[], currentLocation: PlayerLocation, filterSameStation: boolean) {
	const isDocked = isPlayerLocationStation(currentLocation);
	if (!isDocked) {
		filterSameStation = false;
	}

	const lines = orders
		.filter(o => !filterSameStation || isSameStation(o, currentLocation))
		.filter((_o, i) => i < 5)
		.map(o => orderPart(o, currentLocation, filterSameStation));

	if (lines.length === 0) {
		return format.italic('none');
	}

	return lines.join('\n');
}

function orderPart(order: Order, currentLocation: PlayerLocation, filterSameStation: boolean) {
	let text = '';
	text += `${order.amount}x`;
	text += ' ';
	text += order.paperclips;
	text += EMOJIS.paperclip;

	if (!filterSameStation) {
		text += '\n   ';
		text += EMOJIS.station;
		text += formatStation(order.solarsystem, order.station, isSameStation(order, currentLocation));
	}

	return text;
}

function isSameStation(order: Order, location: PlayerLocation) {
	return isPlayerLocationStation(location)
	&& order.solarsystem === location.solarsystem
	&& order.station === location.station;
}

export function tradePart(item: Item, trade: Trade, kind: 'buy' | 'sell') {
	let text = '';
	text += kind === 'buy' ? `${EMOJIS.add}Bought` : `${EMOJIS.remove}Sold`;
	text += ': ';
	text += item;
	text += ' ';
	text += trade.amount;
	text += 'x';
	text += ' ';
	text += trade.paperclips;
	text += EMOJIS.paperclip;
	text += '\n';
	text += '      ';
	text += formatStation(trade.solarsystem, trade.station, true);
	return text;
}
