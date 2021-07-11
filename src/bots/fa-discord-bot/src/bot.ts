import Discord from 'discord.js';
import { logger } from '@zougui/logger';
import { transactionContext } from '@zougui/transaction-context';

import { IConfig } from './config';
import { BrowseCategoryErrorLog } from './logs';
import { browseCategory } from './post-grabber';

export const initBot = async (client: Discord.Client, config: IConfig) => {
  if (config.browse.on.boot) {
    startBrowsing(client, config);
  }

  setInterval(() => {
    //startBrowsing(client, config);
  }, config.browse.on.interval);
}

const startBrowsing = async (client: Discord.Client, config: IConfig) => {
  const transaction = {
    label: 'Browse FA',
    topics: ['FA'],
    data: {},
  };

  await transactionContext.run(transaction, () => browseEverything(client, config));
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
