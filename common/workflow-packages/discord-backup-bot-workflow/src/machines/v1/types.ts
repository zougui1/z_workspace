import Discord from 'discord.js';

import { StateMachineConfig, StateMachineContext, EventObject, InvokeEventObject, Interpreter } from '@zougui/workflow-core';

import { events } from './events';

export interface DiscordBackupBotEvent extends EventObject {
  [events.INIT]: {
    type: events.INIT;
    payload: {
      client: Discord.Client;
      options: BackupOptions;
    };
  };
  [events.START]: {
    type: events.START;
    payload: {};
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

export interface DiscordBackupBotInvokeEvent extends InvokeEventObject {
  ERROR: {
    type: string;
    data: any;
  };
}

export interface DiscordBackupBotStateSchema {
  states: {
    initializing: {};
    idle: {};

    running: {};

    success: {};
    failure: {};
  };
}

export interface DiscordBackupBotContext extends StateMachineContext {
  client: Discord.Client;
  options: BackupOptions;
  error?: any;
}

export type DiscordBackupBotMachineConfig = StateMachineConfig<DiscordBackupBotContext, DiscordBackupBotStateSchema, DiscordBackupBotEvent>;
export type DiscordBackupBotInterpreter = Interpreter<DiscordBackupBotContext, DiscordBackupBotStateSchema, DiscordBackupBotEvent>;

export interface BackupOptions {
  backupDirFormat: string;
  workspaceDir: string;
  threads: number;
  backupsDir: string;
}
