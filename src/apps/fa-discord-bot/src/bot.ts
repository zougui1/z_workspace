import Discord from 'discord.js';
import { logger } from '@zougui/logger';

import { IConfig } from './config';
import { BrowseCategoryErrorLog } from './logs';
import { browseCategory } from './post-grabber';

export const initBot = async (client: Discord.Client, config: IConfig) => {
  if (config.browse.on.boot) {
    browseEverything(client, config);
  }

  setInterval(() => {
    //browseEverything(client, config);
  }, config.browse.on.interval);
}

export const browseEverything = async (client: Discord.Client, config: IConfig): Promise<void> => {
  for (const server of client.guilds.cache.array()) {
    console.log('init')
    const categories = server.channels.cache.filter(c => c.type === 'category').array() as Discord.CategoryChannel[];

    for (const category of categories) {
      try {
        await browseCategory(client, config, category);
      } catch (error) {
        console.log('error', error)
        logger.error(new BrowseCategoryErrorLog({
          server: { name: server.name },
          category: { name: category.name },
          error
        }));
      }
    }
  }
}
