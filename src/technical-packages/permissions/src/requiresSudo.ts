import { logger } from '@zougui/logger';
import { Exception } from '@zougui/error';
import { threadManager } from '@zougui/thread-manager';

import { isRoot } from './isRoot';
import { enforceExitSync } from './enforceExitSync';
import { FORCE_EXIT_TIMEOUT } from './constants';

const EXIT_CODE = 2;

export const requiresSudo = () => {
  if (!isRoot()) {
    logger.error(new Exception('The app must have root permissions.', 'ERR_PERMISSION_DENIED'));
    threadManager.requestExit(EXIT_CODE, { forceTimeout: FORCE_EXIT_TIMEOUT });
    enforceExitSync(EXIT_CODE);
  }
}
