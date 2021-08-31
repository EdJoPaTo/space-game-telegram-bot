import {html as format} from 'telegram-format';

export function infoline(title: string, value: string | number): string {
	return `${format.italic(title)}: ${value}\n`;
}

export function menuPositionPart(menuPosition: readonly string[]) {
	const lines = menuPosition.map((o, i) => '  '.repeat(i) + format.bold(o));
	return lines.join('\n');
}
