import {initBot, startBot} from './bot/index.js';
import {startSiteLogLoop} from './game/site-log-loop.js';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
startup();

async function startup() {
	const telegram = await initBot();
	await startSiteLogLoop(telegram);

	await startBot();
}
