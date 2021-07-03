import './startupSecurity';
import { logger } from '@zougui/logger';
import { threadManager } from '@zougui/thread-manager';

import { startup } from './startup';
import { BotErrorLog } from './logs';

startup().catch(error => {
  logger.error(new BotErrorLog({ error }));
  threadManager.waitToExit(1, { forceTimeout: 1000 });
});
