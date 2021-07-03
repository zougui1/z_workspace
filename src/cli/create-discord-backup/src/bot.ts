import Discord from 'discord.js';

import { createBackup } from './create-backup';
import { IBackupConfig } from './backup-config';

export const initBot = (client: Discord.Client, config: IBackupConfig) => {
  client.on('message', () => createBackup(client, config));
  client.on('messageDelete', () => createBackup(client, config));
  client.on('messageUpdate', () => createBackup(client, config));
}
