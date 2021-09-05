import { logger } from '@zougui/logger';
import { waitSync } from '@zougui/utils';

import { ENFORCE_EXIT_TIMEOUT } from './constants';

export const enforceExitSync = (exitCode: number) => {
  waitSync(ENFORCE_EXIT_TIMEOUT);
  logger.info('The process has forcefully exited.' as any);
  process.exit(exitCode);
}
