import { logger } from '@zougui/logger';
import { createClient } from '@zougui/discord';

import { initBot } from './bot';
import { getConfig } from './config';

export const startup = async () => {
  const config = await getConfig();

  logger.init(config.logs);

  const client = await createClient(config.discord.token, { timeout: config.discord.loginTimeout });
  initBot(client, config);
}
