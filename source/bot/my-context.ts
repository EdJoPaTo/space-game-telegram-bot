import {Context as BaseContext} from 'telegraf';
import {I18nContext} from '@grammyjs/i18n';

import {SiteInstruction} from '../game/typings.js';

export interface Session {
	page?: number;
	planned?: SiteInstruction[];
}

export interface MyContext extends BaseContext {
	readonly i18n: I18nContext;
	session: Session;
}
