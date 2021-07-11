import './startupSecurity';
import { logger } from '@zougui/logger';
import { threadManager } from '@zougui/thread-manager';

import { startup } from './startup';
import { BackupErrorLog } from './logs';

startup().catch(error => {
  logger.error(new BackupErrorLog({ error }));
  threadManager.waitToExit(1, { forceTimeout: 1000 });
});
