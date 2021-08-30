import {initBot, startBot} from './bot/index.js';
import {startNotificationLoop} from './game/notification-loop.js';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
startup();

async function startup() {
	const telegram = await initBot();
	await startNotificationLoop(telegram);

	await startBot();
}
