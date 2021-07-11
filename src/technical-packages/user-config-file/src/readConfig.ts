import fs from 'fs-extra';
import { logger } from '@zougui/logger';

import { resolveReferences } from './resolveReferences';
import { FileReadErrorLog, JsonParseErrorLog } from './logs';
import { ConfigFileNotFoundError, ConfigFileParseError } from './errors';

export const readConfig = async (configPath: string): Promise<unknown> => {
  let backupFile: string;

  try {
    backupFile = await fs.readFile(configPath, 'utf8');
  } catch (error) {
    const exception = new ConfigFileNotFoundError({ error });
    logger.error(new FileReadErrorLog({ error: exception }));
    throw exception;
  }

  let data;

  try {
    data = JSON.parse(backupFile);
  } catch (error) {
    const exception = new ConfigFileParseError({ error });
    logger.error(new JsonParseErrorLog({ error: exception }));
    throw exception;
  }

  return resolveReferences(data);
}
