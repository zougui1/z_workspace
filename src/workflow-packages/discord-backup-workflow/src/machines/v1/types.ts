import Discord from 'discord.js';

import { StateMachineConfig, StateMachineContext, EventObject, InvokeEventObject } from '@zougui/workflow-core';

import { events } from './events';

export interface DiscordBackupEvent extends EventObject {
  [events.INIT]: {
    type: events.INIT;
    payload: {
      client: Discord.Client;
    };
  };
  [events.START]: {
    type: events.START;
    payload: {
      options: BackupOptions;
    };
  };
  [events.MESSAGE_ADD]: {
    type: events.MESSAGE_ADD;
    payload: {};
  };
  [events.MESSAGE_UPDATE]: {
    type: events.MESSAGE_UPDATE;
    payload: {};
  };
  [events.MESSAGE_DELETE]: {
    type: events.MESSAGE_DELETE;
    payload: {};
  };
}

export interface DiscordBackupInvokeEvent extends InvokeEventObject {
  ERROR: {
    type: string;
    data: any;
  };
  DOWNLOADED_SERVERS: {
    type: string;
    data: ServerObject[];
  };
}

export interface DiscordBackupStateSchema {
  states: {
    initializing: {};
    idle: {};

    running: {
      states: {
        downloadingServers: {};
        writingToFileSystem: {};
        compressing: {};
        moving: {};
      };
    };

    success: {};
    failure: {};
  };
}

export interface DiscordBackupContext extends StateMachineContext {
  client: Discord.Client;
  options: BackupOptions;
  servers: ServerObject[];
  error?: any;
}

export type DiscordBackupMachineConfig = StateMachineConfig<DiscordBackupContext, DiscordBackupStateSchema, DiscordBackupEvent>;

export interface BackupOptions {
  workspaceDir: string;
  threads: number;
  backupsDir: string;
}

export interface Backup {
  date: string;
  dateFormat: string;
  server: ServerObject;
  duration: string;
}

export interface ServerObject {
  name: string;
  categories: CategoryObject[];
}

export interface CategoryObject {
  name: string;
  position: number;
  channels: ChannelObject[];
}

export interface ChannelObject {
  type: Discord.GuildChannel['type'];
  name: string;
  position: number;
  messages: MessageObject[];
}

export interface MessageObject {
  content: string;
}
