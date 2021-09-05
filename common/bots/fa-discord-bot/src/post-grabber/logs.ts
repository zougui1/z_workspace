import { LogBuilder } from '@zougui/logger';
import env from '@zougui/env';
import { transactionContext } from '@zougui/transaction-context';

const scope = env.getScope(__filename);

export interface ConfigChannelNotFoundErrorLogData {
  server: string;
  category: string;
}

export const ConfigChannelNotFoundErrorLog = new LogBuilder<ConfigChannelNotFoundErrorLogData>()
  .setCode('discord.server.category.channel.configuration.notFound')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['discord', 'bot', 'configuration'])
  .setOptions(({ data }) => ({
    discord: {
      server: data.server,
      category: data.category,
      channel: 'logs',
      ensureChannel: true,
    },
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

export const InvalidChannelTypeErrorLog = new LogBuilder<InvalidChannelTypeErrorLogData>()
  .setCode('discord.server.category.channel.type.invalid')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['discord', 'bot'])
  .setOptions(({ data }) => ({
    discord: {
      server: data.server,
      category: data.category,
      channel: 'logs',
      ensureChannel: true,
    },
  }))
  .setMessage(({ data }) => `The channel "${data.channel.name}" is of type "${data.channel.type}", but it was expected to be of type "${data.expectedType}"`)
  .toClass();

export interface CreateInexistentChannelLogData {
  channel: string;
  category: string;
  server: string;
}

export const CreateInexistentChannelLog = new LogBuilder<CreateInexistentChannelLogData>()
  .setCode('discord.server.category.channel.inexistent.create')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['discord', 'bot'])
  .setOptions(({ data }) => ({
    discord: {
      server: data.server,
      category: data.category,
      channel: 'logs',
      ensureChannel: true,
    },
  }))
  .setMessage(({ data }) => `Create the channel "${data.channel}"`)
  .toClass();

export interface NoNewPostsLogData {
  server: string;
  category: string;
}

export const NoNewPostsLog = new LogBuilder<NoNewPostsLogData>()
  .setCode('e621.posts.none')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['discord', 'bot'])
  .setOptions(({ data }) => ({
    discord: {
      server: data.server,
      category: data.category,
      channel: 'logs',
      ensureChannel: true,
    },
  }))
  .setMessage('No new posts were found.')
  .toClass();

export interface SetUserActivityErrorLogData {
  error: any;
}

export const SetUserActivityErrorLog = new LogBuilder<SetUserActivityErrorLogData>()
  .setCode('discord.bot.setActivity.error')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['discord', 'bot'])
  .setMessage('Couldn\'t set the user activity.')
  .toClass();
