import fs from 'fs-extra';
import { logger, ExitScope } from '@zougui/logger';
import { Exception } from '@zougui/error';

import { resolveReferences } from './resolveReferences';
import { FileReadErrorLog, JsonParseErrorLog } from './logs';

export const readConfig = async (configPath: string): Promise<unknown> => {
  let backupFile: string;

  try {
    backupFile = await fs.readFile(configPath, 'utf8');
  } catch (error) {
    const exception = new Exception('The config file could not be read', 'ERR_CONFIG_READ', error);
    logger.error(new FileReadErrorLog({ error: exception }));
    throw new ExitScope('read-config', exception);
  }

  let data;

  try {
    data = JSON.parse(backupFile);
  } catch (error) {
    const exception = new Exception('The config file could not be parsed', 'ERR_CONFIG_PARSE', error);
    logger.error(new JsonParseErrorLog({ error: exception }));
    throw new ExitScope('read-config', exception);
  }

  return resolveReferences(data);
}
