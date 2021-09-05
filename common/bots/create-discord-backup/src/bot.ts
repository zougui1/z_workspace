import Discord from 'discord.js';

import { uploadWorkflowEvent } from '@zougui/workflow-core';
import { discordBackupBotMachine } from '@zougui/discord-backup-bot-workflow';

import { IBackupConfig } from './backup-config';

export const initBot = async (client: Discord.Client, config: IBackupConfig) => {
  const discordBackupBot = discordBackupBotMachine.v1.interpret();

  discordBackupBot.onEvent(async event => {
    console.log('event', event.state.value, event.event.type);
    await uploadWorkflowEvent(event);
  });
  discordBackupBot.start();
  discordBackupBot.send('INIT', {
    client,
    options: {
      backupDirFormat: config.backupDirFormat,
      workspaceDir: config.workspaceDir,
      backupsDir: config.backupsDir,
      threads: config.threads,
    },
  });

  startBackupBot(discordBackupBot, config, discordBackupBotMachine.v1.events.START);
  client.on('message', () => startBackupBot(discordBackupBot, config, discordBackupBotMachine.v1.events.MESSAGE_ADD));
  client.on('messageDelete', () => startBackupBot(discordBackupBot, config, discordBackupBotMachine.v1.events.MESSAGE_UPDATE));
  client.on('messageUpdate', () => startBackupBot(discordBackupBot, config, discordBackupBotMachine.v1.events.MESSAGE_DELETE));
}

export const startBackupBot = async (discordBackup: discordBackupBotMachine.DiscordBackupBotInterpreter, config: IBackupConfig, event: StartEvent) => {
  discordBackup.send(event, {});
  await discordBackup.waitDone();
}

type StartEvent = typeof discordBackupBotMachine.v1.events.START |
  typeof discordBackupBotMachine.v1.events.MESSAGE_ADD |
  typeof discordBackupBotMachine.v1.events.MESSAGE_UPDATE |
  typeof discordBackupBotMachine.v1.events.MESSAGE_DELETE;
