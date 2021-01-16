import {MenuTemplate} from 'telegraf-inline-menu';

import {MyContext} from '../my-context';

import {menu as mapMenu} from './map';
import {menu as settingsMenu} from './settings';
import {menu as shipMenu} from './ship';

export const menu = new MenuTemplate<MyContext>(context => context.i18n.t('welcome'));

menu.submenu(context => context.i18n.t('ship.button'), 'ship', shipMenu);
menu.submenu(context => context.i18n.t('map.button'), 'map', mapMenu);

menu.submenu(context => '⚙️' + context.i18n.t('menu.settings'), 'settings', settingsMenu);
