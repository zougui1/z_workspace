import { logger } from '@zougui/logger';

import { threadManager } from './threadManager';

export const catchError = async <T>(callback: () => T): Promise<T> => {
  try {
    return await callback();
  } catch (error) {
    await logger.error(error);
    await threadManager.waitToExit(1);
    process.exit(1);
  }
}
