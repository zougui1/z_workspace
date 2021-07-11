import path from 'path';

import Discord from 'discord.js';
import moment from 'moment';

import { transactionContext } from '@zougui/transaction-context';
import { Interpreter, uploadWorkflowEvent } from '@zougui/workflow-core';
import { discordBackupMachine } from '@zougui/discord-backup-workflow';

import { IBackupConfig } from './backup-config';

export const initBot = async (client: Discord.Client, config: IBackupConfig) => {
  const discordBackup = discordBackupMachine.v1.interpret();

  discordBackup.onEvent(async event => {
    console.log('event', event.state.value, event.event.type);
    await uploadWorkflowEvent(event);
  });
  discordBackup.start();
  discordBackup.send('INIT', { client });

  startBackup(discordBackup, config, discordBackupMachine.v1.events.START);
  client.on('message', () => startBackup(discordBackup, config, discordBackupMachine.v1.events.MESSAGE_ADD));
  client.on('messageDelete', () => startBackup(discordBackup, config, discordBackupMachine.v1.events.MESSAGE_UPDATE));
  client.on('messageUpdate', () => startBackup(discordBackup, config, discordBackupMachine.v1.events.MESSAGE_DELETE));
}

export const executeBackup = async (discordBackup: DiscordInterpreter, config: IBackupConfig, event: StartEvent) => {
  const transactionTime = transactionContext.get('time');
  const backupDate = moment(transactionTime.startedAt);
  const date = backupDate.format(config.backupDirFormat);
  const workspaceDir = path.join(config.workspaceDir, date);
  const backupsDir = path.join(config.backupsDir, date);

  discordBackup.send(event, {
    options: {
      workspaceDir,
      backupsDir,
      threads: config.threads,
    },
  });
}

export const startBackup = async (discordBackup: DiscordInterpreter, config: IBackupConfig, event: StartEvent) => {
  const transaction = {
    label: 'Create discord backup',
    topics: ['backup', 'discord'],
    data: {},
  };

  await transactionContext.run(transaction, () => executeBackup(discordBackup, config, event));
}

type DiscordInterpreter = Interpreter<discordBackupMachine.DiscordBackupContext, discordBackupMachine.DiscordBackupStateSchema, discordBackupMachine.DiscordBackupEvent>;
type StartEvent = typeof discordBackupMachine.v1.events.START |
  typeof discordBackupMachine.v1.events.MESSAGE_ADD |
  typeof discordBackupMachine.v1.events.MESSAGE_UPDATE |
  typeof discordBackupMachine.v1.events.MESSAGE_DELETE;
