import {TtlKeyValueInMemoryFile} from '@edjopato/datastore';
import arrayFilterUnique from 'array-filter-unique';

const openOverviews = new TtlKeyValueInMemoryFile<number[]>('persist/open-overviews.json');
const TTL = 1000 * 60 * 60 * 48; // 48 hours

export async function popOpenOverviews(player: number) {
	const message_ids = openOverviews.get(String(player)) ?? [];
	await openOverviews.delete(String(player));
	return message_ids;
}

export async function addOpenOverviews(player: number, message_id: number) {
	let message_ids = openOverviews.get(String(player)) ?? [];
	message_ids.push(message_id);
	message_ids = message_ids.filter(arrayFilterUnique());
	await openOverviews.set(String(player), message_ids, TTL);
}
