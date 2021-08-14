export async function sleep(milliseconds: number) {
	return new Promise(resolve => {
		setTimeout(resolve, milliseconds);
	});
}

export function typedKeys<T extends keyof any>(record: Record<T, unknown>): T[] {
	return (Object.keys(record) as unknown[]) as T[];
}

export function unreachable(_: never): never {
	throw new Error('Should have been unreachable but looks like it wasnt.');
}
