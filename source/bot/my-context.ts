import {Context as BaseContext} from 'telegraf';
import {I18nContext} from '@grammyjs/i18n';

export interface Session {
	page?: number;
}

export interface MyContext extends BaseContext {
	readonly i18n: I18nContext;
	session: Session;
}
