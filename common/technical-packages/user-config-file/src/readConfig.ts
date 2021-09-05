import fs from 'fs-extra';
import { logger } from '@zougui/logger';

import { resolveReferences } from './resolveReferences';
import { FileReadErrorLog, JsonParseErrorLog } from './logs';
import { ConfigFileNotFoundError, ConfigFileParseError } from './errors';

const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;
const reDateSeparators = /[-+,.]/;

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
    data = JSON.parse(backupFile, dateParser);
  } catch (error) {
    const exception = new ConfigFileParseError({ error });
    logger.error(new JsonParseErrorLog({ error: exception }));
    throw exception;
  }

  return resolveReferences(data);
}

const dateParser = (key: string, value: any): any => {
  if (typeof value === 'string') {
    const isIsoDate = reISO.test(value);

    if (isIsoDate) {
      return new Date(value);
    }

    const msAjaxDate = reMsAjax.exec(value);

    if (msAjaxDate) {
      const dateParts = msAjaxDate[1].split(reDateSeparators);
      const dateStr = dateParts[0] ? +dateParts[0] : 0 - +dateParts[1];
      return new Date(dateStr);
    }
  }

  return value;
};
