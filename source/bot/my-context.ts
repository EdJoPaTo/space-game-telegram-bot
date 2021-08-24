import {Context as BaseContext} from 'telegraf';
import {I18nContext} from '@grammyjs/i18n';

import {ContextGameProperty} from './overview/context-game-property.js';

export interface Session {
	page?: number;
}

export interface I18nContextFlavour {
	readonly i18n: I18nContext;
}

interface SessionContextFlavour {
	session: Session;
	readonly game: ContextGameProperty;
}

export type MyContext = BaseContext & I18nContextFlavour & SessionContextFlavour;
