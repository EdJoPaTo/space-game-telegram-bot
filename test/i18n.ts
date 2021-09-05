import test, {ExecutionContext} from 'ava';
import {I18n} from '@grammyjs/i18n';

import {
	FACILITIES,
	ITEMS,
	ITEMS_BY_CATEGORY,
	SHIP_LAYOUTS,
} from '../source/game/statics.js';
import {typedKeys} from '../source/javascript-helper.js';

const i18n = new I18n({
	directory: 'locales',
	defaultLanguage: 'en',
	defaultLanguageOnMissing: true,
});

function checkKeysExisting(t: ExecutionContext, languageCode: string, keys: readonly string[]) {
	const allResourceKeys = i18n.resourceKeys(languageCode);
	for (const key of keys) {
		if (!allResourceKeys.includes(key)) {
			t.fail(`${languageCode} resourceKey ${key} is missing`);
		}
	}

	t.pass();
}

test('facilities', t => {
	checkKeysExisting(t, 'en', typedKeys(FACILITIES).map(o => `static.${o}.title`));
});

test('facilities services', t => {
	checkKeysExisting(t, 'en', Object.values(FACILITIES).flatMap(o => o.services).map(o => `service.${o}.button`));
	checkKeysExisting(t, 'en', Object.values(FACILITIES).flatMap(o => o.services).map(o => `service.${o}.starting`));
});

test('items', t => {
	checkKeysExisting(t, 'en', typedKeys(ITEMS).map(o => `item.${o}.title`));
});

test('item categories', t => {
	checkKeysExisting(t, 'en', typedKeys(ITEMS_BY_CATEGORY).map(o => `itemCategory.${o}.title`));
	checkKeysExisting(t, 'en', typedKeys(ITEMS_BY_CATEGORY).map(o => `itemCategory.${o}.description`));
});

test('ship classes', t => {
	checkKeysExisting(t, 'en', Object.values(SHIP_LAYOUTS).flatMap(o => o.class).map(o => `static.${o}.title`));
});
