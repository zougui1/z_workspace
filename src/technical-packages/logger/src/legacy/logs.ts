import { Log } from './log-utils/LogV2';

export const LoggerInitializedLog = new Log()
  .setCode('logger.alreadyInitialized')
  .setTopics(['logger', 'initialization'])
  .setMessage('The logger has already been initialized.')
  .toClass();

export const LogBeforeConfigurationLog = new Log()
  .setCode('logger.log.unconfigured')
  .setTopics(['logger', 'configuration'])
  .setMessage('Tried to log without config. Switched to fallback config')
  .toClass();
