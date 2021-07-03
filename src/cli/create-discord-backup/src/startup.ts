import path from 'path';
import moment from 'moment';
import { logger } from '@zougui/logger';

import { createClient } from './client';
import { initBot } from './bot';
import { getBackupConfig } from './backup-config';

export const startup = async () => {
  const config = await getBackupConfig();

  logger.init({
    ...config.logs.transports,
    discord: undefined,
    file: {
      ...config.logs.transports.file,
      fileName: path.join(config.logs.transports.file.dir, `${moment().format(config.backupDirFormat)}.yml`),
    },
  }, {
    dateFormat: config.dateFormat,
  });

  const client = await createClient(config.discord.token, { timeout: config.discord.loginTimeout });
  initBot(client, config);
}
