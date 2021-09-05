import Discord from 'discord.js';
import { logger } from '@zougui/logger';

import { getCategoryChannels } from './getCategoryChannels';
import { renderPost } from './renderPost';
import { fetchE621Posts } from './e621-grabber';
import { NoNewPostsLog, SetUserActivityErrorLog } from './logs';
import { IConfig } from '../config';
import { getBrowsingData, updateBrowsingData } from '../browsing-data';
import { getDiscordConfig } from '../discord-config';

export const browseCategory = async (client: Discord.Client, config: IConfig, category: Discord.CategoryChannel) => {
  try {
    await browseCategoryUnsafe(client, config, category);
  } finally {
    setActivity(client);
  }
}

const browseCategoryUnsafe = async (client: Discord.Client, config: IConfig, category: Discord.CategoryChannel) => {
  setActivity(client, 'Initializing...');

  const channels = await getCategoryChannels(category);
  const browsingConfig = await getDiscordConfig(channels.configuration);
  const browsing = await getBrowsingData(channels.data);

  setActivity(client, 'Browsing...');

  const posts = await fetchE621Posts({
    fileConfig: config,
    browsingDiscordConfig: browsingConfig.data,
    browsingData: browsing.data,
  });

  if (!posts.length) {
    logger.info(new NoNewPostsLog({ category: category.name, server: category.guild.name }));
    return;
  }

  setActivity(client, 'Posting...');

  for (const post of posts) {
    const message = browsingConfig.data.renderPost
      .map(renderConfig => renderPost(post, renderConfig, browsingConfig.data))
      .filter(part => part)
      .join('\n');

    await channels.posts.send(message);
  }

  await updateBrowsingData(browsing, {
    client,
    lastPosts: {
      e621: posts[0].url
    },
    channel: channels.data,
  });
}

const setActivity = (client: Discord.Client, activity?: string): void => {
  const settingActivity = activity
    ? client.user?.setActivity(activity)
    : client.user?.setActivity();

  settingActivity?.catch(error => logger.error(new SetUserActivityErrorLog({ error })));
}
