import test, {ExecutionContext} from 'ava';
import {I18n} from '@grammyjs/i18n';

import {
	FACILITIES,
	LIFELESS_THINGIES,
	MODULE_PASSIVE,
	MODULE_TARGETED,
	MODULE_UNTARGETED,
	SHIP_LAYOUTS,
} from '../source/game/get-static.js';
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
	checkKeysExisting(t, 'en', Object.values(FACILITIES).flatMap(o => o.services).map(o => `service.${o}`));
});

test('lifeless', t => {
	checkKeysExisting(t, 'en', typedKeys(LIFELESS_THINGIES).map(o => `static.${o}.title`));
});

test('passive modules', t => {
	checkKeysExisting(t, 'en', typedKeys(MODULE_PASSIVE).map(o => `module.${o}.title`));
});

test('targeted modules', t => {
	checkKeysExisting(t, 'en', typedKeys(MODULE_TARGETED).map(o => `module.${o}.title`));
});

test('untargeted modules', t => {
	checkKeysExisting(t, 'en', typedKeys(MODULE_UNTARGETED).map(o => `module.${o}.title`));
});

test('ship layouts', t => {
	checkKeysExisting(t, 'en', typedKeys(SHIP_LAYOUTS).map(o => `static.${o}.title`));
});
