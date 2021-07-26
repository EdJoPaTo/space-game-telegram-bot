import {Context as BaseContext} from 'telegraf';
import {I18nContext} from '@edjopato/telegraf-i18n';

export interface Session {
	page?: number;
	planned?: string[];
}

export interface MyContext extends BaseContext {
	readonly i18n: I18nContext;
	session: Session;
}
