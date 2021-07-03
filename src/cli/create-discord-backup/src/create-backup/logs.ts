import { Log } from '@zougui/logger';

export interface SetUserActivityErrorLogData {
  error: any;
}

export const SetUserActivityErrorLog = new Log<SetUserActivityErrorLogData>()
  .setCode('discord.bot.setActivity.error')
  .setTopics(['discord', 'bot', 'activity'])
  .setMessage('Couldn\'t set the user activity.')
  .toClass();

export interface GetServersErrorLogData {
  error: any;
}

export const GetServersErrorLog = new Log<GetServersErrorLogData>()
  .setCode('discord.servers.error')
  .setTopics(['discord', 'bot'])
  .setMessage('Couldn\'t get the servers to back-up.')
  .toClass();

export interface DownloadServerLogData {
  name: string;
}

export const DownloadServerLog = new Log<DownloadServerLogData>()
  .setCode('discord.servers.download.start')
  .setTopics(['discord', 'bot'])
  .setMessage(({ data }) => `Downloading the server "${data.name}"`)
  .toClass();

export interface DownloadedServerLogData {
  name: string;
}

export const DownloadedServerLog = new Log<DownloadedServerLogData>()
  .setCode('discord.servers.download.success')
  .setTopics(['discord', 'bot'])
  .setMessage(({ data }) => `Downloaded the server "${data.name}"`)
  .toClass();
