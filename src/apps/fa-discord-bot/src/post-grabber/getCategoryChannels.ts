import Discord from 'discord.js';
import { logger } from '@zougui/logger';

import {
  ConfigChannelNotFoundErrorLog,
  InvalidChannelTypeErrorLog, InvalidChannelTypeErrorLogData,
  CreateInexistentChannelLog, CreateInexistentChannelLogData,
} from './logs';

const expectedType = 'text';

export const getCategoryChannels = async (category: Discord.CategoryChannel): Promise<IChannels> => {
  const configuration = category.children.find(channel => channel.name === 'configuration');
  let posts = category.children.find(channel => channel.name === 'posts');
  let logs = category.children.find(channel => channel.name === 'logs');
  let data = category.children.find(channel => channel.name === 'data');

  if (!configuration) {
    const error = new ConfigChannelNotFoundErrorLog({
      server: category.guild.name,
      category: category.name,
    });
    logger.error(error);
    // TODO throw an exception
    throw error;
  }

  if (configuration.type !== expectedType) {
    const errorData = getInvalidChannelTypeData(category, configuration, expectedType);
    const error = new InvalidChannelTypeErrorLog(errorData);
    logger.error(error);
    // TODO throw an exception
    throw error;
  }

  if (posts && posts.type !== expectedType) {
    const errorData = getInvalidChannelTypeData(category, posts, expectedType);
    const error = new InvalidChannelTypeErrorLog(errorData);
    logger.error(error);
    // TODO throw an exception
    throw error;
  }

  if (logs && logs.type !== expectedType) {
    const errorData = getInvalidChannelTypeData(category, logs, expectedType);
    const error = new InvalidChannelTypeErrorLog(errorData);
    logger.error(error);
    // TODO throw an exception
    throw error;
  }

  if (data && data.type !== expectedType) {
    const errorData = getInvalidChannelTypeData(category, data, expectedType);
    const error = new InvalidChannelTypeErrorLog(errorData);
    logger.error(error);
    // TODO throw an exception
    throw error;
  }

  if (!posts) {
    const channelName = 'posts';
    const errorData = getCreateChannelData(category, channelName);
    logger.info(new CreateInexistentChannelLog(errorData));
    posts = await configuration.guild.channels.create(channelName, { nsfw: true, parent: category });
  }

  if (!logs) {
    const channelName = 'logs';
    const errorData = getCreateChannelData(category, channelName);
    logger.info(new CreateInexistentChannelLog(errorData));
    logs = await configuration.guild.channels.create(channelName, { parent: category });
  }

  if (!data) {
    const channelName = 'data';
    const errorData = getCreateChannelData(category, channelName);
    logger.info(new CreateInexistentChannelLog(errorData));
    data = await configuration.guild.channels.create(channelName, { parent: category });
  }

  return {
    configuration: configuration as Discord.TextChannel,
    posts: posts as Discord.TextChannel,
    logs: logs as Discord.TextChannel,
    data: data as Discord.TextChannel,
  }
}

const getInvalidChannelTypeData = (category: Discord.CategoryChannel, channel: Discord.GuildChannel, expectedType: string): InvalidChannelTypeErrorLogData => {
  return {
    expectedType,
    channel: {
      name: channel.name,
      type: channel.type,
    },
    category: category.name,
    server: category.guild.name,
  }
}

const getCreateChannelData = (category: Discord.CategoryChannel, channel: string): CreateInexistentChannelLogData => {
  return {
    channel,
    category: category.name,
    server: category.guild.name,
  }
}

export interface IChannels {
  configuration: Discord.TextChannel;
  posts: Discord.TextChannel;
  logs: Discord.TextChannel;
  data: Discord.TextChannel;
}
