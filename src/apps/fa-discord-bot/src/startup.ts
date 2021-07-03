import path from 'path';
import moment from 'moment';
import { logger } from '@zougui/logger';

import { createClient } from './client';
import { initBot } from './bot';
import { getConfig } from './config';

const LOG_DATE_FORMAT = 'YYYY-MM-DD';

export const startup = async () => {
  const config = await getConfig();

  logger.init({
    ...config.logs.transports,
    //discord: undefined,
    file: {
      ...config.logs.transports.file,
      fileName: path.join(config.logs.transports.file.dir, `${moment().format(LOG_DATE_FORMAT)}.yml`),
    },
  }, {
    dateFormat: config.dateFormat,
  });

  const client = await createClient(config.discord.token, { timeout: config.discord.loginTimeout });
  initBot(client, config);
}
