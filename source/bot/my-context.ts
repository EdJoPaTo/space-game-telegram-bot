import {Context as BaseContext} from 'telegraf';
import {I18nContext} from '@edjopato/telegraf-i18n';

import {Instruction} from '../game/types/dynamic/instruction.js';

export interface Session {
	page?: number;
	planned?: Instruction[];
}

export interface MyContext extends BaseContext {
	readonly i18n: I18nContext;
	session: Session;
}
