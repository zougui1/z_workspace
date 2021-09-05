import { getError } from '@zougui/error';
import { logger } from '@zrpg/log-http-client';

import { SHUTDOWN_SIGNALS } from './constants';

let exited = false;

const onExit = async () => {
  if (exited) {
    return;
  }

  exited = true;

  try {
    await logger.exitGame();
  } catch (error) {
    process.exit(1);
  }
}

export const onError = (callback: (error: any) => void) => {
  const onFatalError = async (error: any) => {
    console.error(error);
    await logger.log(`Fatal error: ${getError(error)}`);
    await onExit();
    callback(error);
    process.exit(1);
  }

  process.on('uncaughtException', onFatalError);
  process.on('unhandledRejection', onFatalError);
}

export const enableGracefulExit = () => {
  for (const sig of SHUTDOWN_SIGNALS) {
    process.on(sig, async () => {
      await logger.log(`Received signal: ${sig}`);
      await onExit();
    });
  }
}

export const exit = async () => {
  await logger.log('Manual exit');
  await onExit();
  process.exit(0);
}
