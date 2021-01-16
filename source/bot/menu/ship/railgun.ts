import {Body, MenuTemplate} from 'telegraf-inline-menu';
import {markdown as format} from 'telegram-format';

import {backButtons} from '../general';
import {isDirection} from '../../../game/position';
import {MyContext} from '../../my-context';
import {Railgun, Ship, RAILGUN_SLUG_STORAGE} from '../../../game/types';

import {getShip, moduleHeader, saveShipWithModules} from './helper';

function fromCtx(context: MyContext): Readonly<{ship: Ship; modules: readonly Railgun[]; slugs: number}> {
	const ship = getShip(context.from!.id);
	const modules = ship.modules.filter(o => o.module === 'Railgun') as readonly Railgun[];
	// eslint-disable-next-line unicorn/no-array-reduce
	const slugs = modules.map(o => o.slugs).reduce((a, b) => a + b, 0);
	return {ship, modules, slugs};
}

function menuBody(context: MyContext): Body {
	const module = 'Railgun';

	const {modules, slugs} = fromCtx(context);

	let text = '';
	text += moduleHeader(context, module, modules.length);

	text += context.i18n.t('ship.module.Railgun.slugs');
	text += ': ';
	text += slugs;
	text += ' / ';
	text += modules.length * RAILGUN_SLUG_STORAGE;

	return {text, parse_mode: format.parse_mode};
}

export const menu = new MenuTemplate<MyContext>(menuBody);

menu.choose('shoot', ['NW', 'N', 'NE', 'W', ' ', 'E', 'SW', 'S', 'SE'], {
	columns: 3,
	hide: async context => fromCtx(context).slugs <= 0,
	do: async (context, direction) => {
		if (!isDirection(direction)) {
			await context.answerCbQuery('Please dont shoot yourself!');
			return false;
		}

		const {ship, modules} = fromCtx(context);
		const newRailguns: Railgun[] = modules
			.map(o => ({module: 'Railgun', slugs: Math.max(0, o.slugs - 1)}));

		const newModules = [
			...ship.modules.filter(o => o.module !== 'Railgun'),
			...newRailguns
		];

		await saveShipWithModules(context.from!.id, newModules);

		await context.answerCbQuery('TODO: create actual flying slug in space into direction ' + direction);
		return true;
	}
});

menu.interact('CHEAT module', 'cheat-module', {
	do: async context => {
		const {ship} = fromCtx(context);
		const railgun: Railgun = {
			module: 'Railgun',
			slugs: 0
		};
		const newModules = [...ship.modules, railgun];
		await saveShipWithModules(context.from!.id, newModules);
		return true;
	}
});

menu.interact('CHEAT ammo', 'cheat-ammo', {
	hide: context => {
		const {modules, slugs} = fromCtx(context);
		return slugs >= modules.length * RAILGUN_SLUG_STORAGE;
	},
	do: async context => {
		const {ship, modules} = fromCtx(context);
		const newRailguns: Railgun[] = modules
			.map(() => ({module: 'Railgun', slugs: RAILGUN_SLUG_STORAGE}));

		const newModules = [
			...ship.modules.filter(o => o.module !== 'Railgun'),
			...newRailguns
		];

		await saveShipWithModules(context.from!.id, newModules);
		return true;
	}
});

menu.manualRow(backButtons);
