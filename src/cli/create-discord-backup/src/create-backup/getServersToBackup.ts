import Discord from 'discord.js';
import { logger } from '@zougui/logger';

import { DownloadServerLog, DownloadedServerLog } from './logs';
import { IServerBackup, ICategoryBackup, IChannelBackup, IMessageBackup } from './create-backup-types';
import { IBackupConfig } from '../backup-config';

const MESSAGES_LIMIT = 100;

export const getServersToBackup = async (client: Discord.Client, config: IBackupConfig) => {
  const guilds = client.guilds.cache.filter(guild => guild.name !== config.logs.transports.discord.server);
  return await Promise.all(guilds.map(mapServer));
}

const mapServer = async (guild: Discord.Guild): Promise<IServerBackup> => {
  logger.info(new DownloadServerLog({ name: guild.name }));
  // turn the Collection into an array
  const channels = guild.channels.cache.map(channel => channel);

  const server: IServerBackup = {
    name: guild.name,
    categories: await mapCategories(channels),
  };

  logger.info(new DownloadedServerLog({ name: guild.name }));
  return server;
}

const mapCategories = async (channels: Discord.GuildChannel[]): Promise<ICategoryBackup[]> => {
  const categories = channels.filter(channel => channel.type === 'category') as Discord.CategoryChannel[];
  return await Promise.all(categories.map(category => mapCategory(category, channels)));
}

const mapCategory = async (category: Discord.CategoryChannel, channels: Discord.GuildChannel[]): Promise<ICategoryBackup> => {
  const childrenChannels = channels.filter(channel => channel.isText() && channel.parent?.name === category.name);

  return {
    name: category.name,
    position: category.position,
    channels: await Promise.all(childrenChannels.map(mapChannel)),
  };
}

const mapChannel = async (channel: Discord.GuildChannel): Promise<IChannelBackup> => {
  return {
    type: channel.type,
    name: channel.name,
    position: channel.position,
    messages: await mapMessages(channel),
  };
}

const mapMessages = async (channel: Discord.GuildChannel): Promise<IMessageBackup[]> => {
  if (!channel.isText()) {
    return [];
  }

  const messages = await channel.messages.fetch({ limit: MESSAGES_LIMIT });

  return messages.map(message => {
    return { content: message.content };
  });
}
