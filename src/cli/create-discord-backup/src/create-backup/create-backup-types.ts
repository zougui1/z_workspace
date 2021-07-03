import Discord from 'discord.js';

export interface IBackup {
  date: string;
  server: IServerBackup;
  duration: string;
}

export interface IServerBackup {
  name: string;
  categories: ICategoryBackup[];
}

export interface ICategoryBackup {
  name: string;
  position: number;
  channels: IChannelBackup[];
}

export interface IChannelBackup {
  type: Discord.GuildChannel['type'];
  name: string;
  position: number;
  messages: IMessageBackup[];
}

export interface IMessageBackup {
  content: string;
}
