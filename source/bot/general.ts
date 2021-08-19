import {createBackMainMenuButtons} from 'telegraf-inline-menu';

import {I18nContextFlavour} from './my-context.js';

export const backButtons = createBackMainMenuButtons<I18nContextFlavour>(
	context => context.i18n.t('menu.back'),
	context => context.i18n.t('menu.main'),
);

export function choicesByArrayIndex(array: readonly string[]) {
	const result: Record<string, string> = {};
	for (const [index, content] of Object.entries(array)) {
		result[index] = content;
	}

	return result;
}
