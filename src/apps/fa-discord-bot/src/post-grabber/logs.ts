import { Log } from '@zougui/logger';

export interface ConfigChannelNotFoundErrorLogData {
  server: string;
  category: string;
}

export const ConfigChannelNotFoundErrorLog = new Log<ConfigChannelNotFoundErrorLogData>()
  .setCode('discord.server.category.channel.configuration.notFound')
  .setTopics(['discord', 'bot', 'configuration'])
  .setDiscordOptions(({ data }) => ({
    server: data.server,
    category: data.category,
    channel: 'logs',
    ensureChannel: true,
  }))
  .setMessage(({ data }) => `No configuration channel found for the category "${data.category}"`)
  .toClass();

export interface InvalidChannelTypeErrorLogData {
  expectedType: string;
  channel: {
    name: string;
    type: string;
  };
  category: string;
  server: string;
}

export const InvalidChannelTypeErrorLog = new Log<InvalidChannelTypeErrorLogData>()
  .setCode('discord.server.category.channel.type.invalid')
  .setTopics(['discord', 'bot'])
  .setDiscordOptions(({ data }) => ({
    server: data.server,
    category: data.category,
    channel: 'logs',
    ensureChannel: true,
  }))
  .setMessage(({ data }) => `The channel "${data.channel.name}" is of type "${data.channel.type}", but it was expected to be of type "${data.expectedType}"`)
  .toClass();

export interface CreateInexistentChannelLogData {
  channel: string;
  category: string;
  server: string;
}

export const CreateInexistentChannelLog = new Log<CreateInexistentChannelLogData>()
  .setCode('discord.server.category.channel.inexistent.create')
  .setTopics(['discord', 'bot'])
  .setDiscordOptions(({ data }) => ({
    server: data.server,
    category: data.category,
    channel: 'logs',
    ensureChannel: true,
  }))
  .setMessage(({ data }) => `Create the channel "${data.channel}"`)
  .toClass();

export interface NoNewPostsLogData {
  server: string;
  category: string;
}

export const NoNewPostsLog = new Log<NoNewPostsLogData>()
  .setCode('e621.posts.none')
  .setTopics(['discord', 'bot'])
  .setDiscordOptions(({ data }) => ({
    server: data.server,
    category: data.category,
    channel: 'logs',
    ensureChannel: true,
  }))
  .setMessage('No new posts were found.')
  .toClass();

export interface SetUserActivityErrorLogData {
  error: any;
}

export const SetUserActivityErrorLog = new Log<SetUserActivityErrorLogData>()
  .setCode('discord.bot.setActivity.error')
  .setTopics(['discord', 'bot'])
  .setMessage('Couldn\'t set the user activity.')
  .toClass();
