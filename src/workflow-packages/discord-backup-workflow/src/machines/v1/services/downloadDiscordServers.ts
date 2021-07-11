import Discord from 'discord.js';

import { safelySetActivity } from '@zougui/discord';
import { logger } from '@zougui/logger';

import { DownloadServerLog, DownloadedServerLog } from './logs';
import { ServerObject, CategoryObject, ChannelObject, MessageObject } from '../types';

const MESSAGES_LIMIT = 100;

export const downloadDiscordServers = async (client: Discord.Client): Promise<ServerObject[]> => {
  safelySetActivity(client.user, 'Downloading servers...');
  const guilds = client.guilds.cache.array();

  return await Promise.all(guilds.map(mapServer));
}

const mapServer = async (guild: Discord.Guild): Promise<ServerObject> => {
  logger.info(new DownloadServerLog({ name: guild.name }));
  // turn the Collection into an array
  const channels = guild.channels.cache.array();
  const categories = channels.filter(channel => channel.type === 'category') as Discord.CategoryChannel[];

  const server: ServerObject = {
    name: guild.name,
    categories: await Promise.all(categories.map(category => mapCategory(category, channels))),
  };

  logger.info(new DownloadedServerLog({ name: guild.name }));
  return server;
}

const mapCategory = async (category: Discord.CategoryChannel, channels: Discord.GuildChannel[]): Promise<CategoryObject> => {
  const childrenChannels = channels.filter(channel => channel.isText() && channel.parent?.name === category.name);

  return {
    name: category.name,
    position: category.position,
    channels: await Promise.all(childrenChannels.map(mapChannel)),
  };
}

const mapChannel = async (channel: Discord.GuildChannel): Promise<ChannelObject> => {
  return {
    type: channel.type,
    name: channel.name,
    position: channel.position,
    messages: await mapMessages(channel),
  };
}

const mapMessages = async (channel: Discord.GuildChannel): Promise<MessageObject[]> => {
  if (!channel.isText()) {
    return [];
  }

  const messages = await channel.messages.fetch({ limit: MESSAGES_LIMIT });

  return messages.map(message => {
    return { content: message.content };
  });
}
