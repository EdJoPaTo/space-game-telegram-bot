export async function sleep(milliseconds: number) {
	return new Promise(resolve => {
		setTimeout(resolve, milliseconds);
	});
}

export function typedKeys<T extends keyof any>(record: Readonly<Partial<Record<T, unknown>>>): T[] {
	if (!record) {
		return [];
	}

	return (Object.keys(record) as unknown[]) as T[];
}

export function typedEntities<K extends keyof any, V>(record: Readonly<Partial<Record<K, V>>>): Array<[K, V]> {
	if (!record) {
		return [];
	}

	return (Object.entries(record) as unknown[]) as Array<[K, V]>;
}

export function unreachable(unreachable: never): never {
	throw new Error('Should have been unreachable but looks like it wasnt: ' + JSON.stringify(unreachable));
}
