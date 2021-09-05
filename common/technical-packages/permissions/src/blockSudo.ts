import { logger } from '@zougui/logger';
import { Exception } from '@zougui/error';
import { threadManager } from '@zougui/thread-manager';

import { isRoot } from './isRoot';
import { enforceExitSync } from './enforceExitSync';
import { FORCE_EXIT_TIMEOUT } from './constants';

const EXIT_CODE = 77;

export const blockSudo = () => {
  if (isRoot()) {
    logger.error(new (Exception as any)('You are not allowed to run this app with root permissions.', 'ERR_FORBIDDEN_ROOT_PERMISSIONS'));
    threadManager.requestExit(EXIT_CODE, { forceTimeout: FORCE_EXIT_TIMEOUT });
    enforceExitSync(EXIT_CODE);
  }
}
