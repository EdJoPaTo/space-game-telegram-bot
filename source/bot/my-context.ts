import {Context as BaseContext} from 'telegraf';
import {I18nContext} from '@grammyjs/i18n';

export interface Session {
	page?: number;
}

export interface I18nContextFlavour {
	readonly i18n: I18nContext;
}

export interface SessionContextFlavour {
	session: Session;
}

export type MyContext = BaseContext & I18nContextFlavour & SessionContextFlavour;
