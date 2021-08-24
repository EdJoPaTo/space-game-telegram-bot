import {html as format} from 'telegram-format';

export function infoline(title: string, value: string): string {
	return format.italic(title) + ': ' + value + '\n';
}
