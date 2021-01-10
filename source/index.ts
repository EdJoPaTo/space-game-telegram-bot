import {start as startBot} from './bot';
import {start as startGameloop} from './game/gameloop';

startGameloop();

// eslint-disable-next-line @typescript-eslint/no-floating-promises
startBot();
