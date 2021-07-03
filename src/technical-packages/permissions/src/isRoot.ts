import { logger } from '@zougui/logger';

export const isRoot = (): boolean => {
  const isRoot = process.getuid() === 0;

  if (isRoot) {
    logger.info(`The process is running with root permissions.`);
  }

  return isRoot;
}
