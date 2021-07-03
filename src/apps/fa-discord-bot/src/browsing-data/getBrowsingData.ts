import Discord from 'discord.js';
import { readLastJsonMessage, ReadMessage } from '@zougui/discord';

import { browsingDataSchema } from './browsingDataSchema';
import { BrowsingData } from './browsing-data-types';

export const getBrowsingData = async (channel: Discord.TextChannel): Promise<ReadMessage<BrowsingData>> => {
  const lastMessage = await readLastJsonMessage(channel, { schema: browsingDataSchema }) as ReadMessage<BrowsingData> | undefined;


  if (lastMessage) {
    return lastMessage;
  }

  const data: BrowsingData = {
    lastPosts: {
      e621: {
        url: '',
        failsafeDate: '',
      },
    },
  };
  const message = await channel.send(JSON.stringify(data, null, 2));

  return { message, data };
}
