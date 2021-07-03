import Discord from 'discord.js';
import moment from 'moment';
import { ReadMessage, getJsonCodeBlock } from '@zougui/discord';

import { BrowsingData } from './browsing-data-types';
import { FAILSAFE_DATE_FORMAT } from '../constants';

export const updateBrowsingData = async (browsing: ReadMessage<BrowsingData>, options: UpdateBrowsingDataOptions) => {
  const { client, lastPosts, channel } = options;
  const failsafeDate = moment().subtract(1, 'day').format(FAILSAFE_DATE_FORMAT);

  if (lastPosts.e621) {
    browsing.data.lastPosts.e621.url = lastPosts.e621;
    browsing.data.lastPosts.e621.failsafeDate = failsafeDate;
  }

  const ownsBrowsingMessage = browsing.message.author.id === client.user?.id;
  const newData = getJsonCodeBlock(browsing.data);

  if (ownsBrowsingMessage) {
    await browsing.message.edit(newData);
  } else {
    await channel.send(newData);
  }
}

export interface LastPosts {
  e621?: string;
}

export interface UpdateBrowsingDataOptions {
  client: Discord.Client;
  lastPosts: LastPosts;
  channel: Discord.TextChannel;
}
