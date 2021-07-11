import { logger } from '@zougui/logger';
import { createClient } from '@zougui/discord';

import { initBot } from './bot';
import { getBackupConfig } from './backup-config';

export const startup = async () => {
  const config = await getBackupConfig();

  logger.init(config.logs);

  const client = await createClient(config.discord.token, { timeout: config.discord.loginTimeout });
  initBot(client, config);
}
