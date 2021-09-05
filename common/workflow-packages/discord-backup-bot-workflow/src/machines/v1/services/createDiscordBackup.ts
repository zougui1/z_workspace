import Discord from 'discord.js';
import path from 'path';
import moment from 'moment';

import { discordBackupMachine } from '@zougui/discord-backup-workflow';
import { uploadWorkflowEvent } from '@zougui/workflow-core';
import { transactionContext } from '@zougui/transaction-context';

import { BackupOptions } from '../types';

const discordBackupTransaction = {
  label: 'Create discord backup',
  topics: ['backup', 'discord'],
  data: {},
};

export const createDiscordBackup = async (client: Discord.Client, options: BackupOptions) => {
  const discordBackup = discordBackupMachine.v1.interpret();

  discordBackup.onEvent(async event => {
    console.log('event', event.state.value, event.event.type);
    await uploadWorkflowEvent(event);
  });

  await transactionContext.run(discordBackupTransaction, () => runDiscordBackupWorkflow(discordBackup, client, options));
}

const runDiscordBackupWorkflow = async (discordBackup: discordBackupMachine.DiscordInterpreter, client: Discord.Client, options: BackupOptions) => {
  const transactionTime = transactionContext.get('time');
  const backupDate = moment(transactionTime.startedAt);
  const date = backupDate.format(options.backupDirFormat);
  const workspaceDir = path.join(options.workspaceDir, date);
  const backupsDir = path.join(options.backupsDir, date);

  discordBackup.start();
  discordBackup.send(discordBackupMachine.v1.events.INIT, {
    client,
    options: {
      workspaceDir,
      backupsDir,
      threads: options.threads,
    },
  });

  discordBackup.send(discordBackupMachine.v1.events.START, {});

  await discordBackup.waitDone();
}
