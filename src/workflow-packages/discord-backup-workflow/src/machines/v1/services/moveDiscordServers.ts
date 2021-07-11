import Discord from 'discord.js';

import { safelySetActivity } from '@zougui/discord';
import { bash } from '@zougui/bash';

import { BackupOptions } from '../types';

export const moveDiscordServers = async (client: Discord.Client, options: BackupOptions) => {
  safelySetActivity(client.user, 'Moving backed-up servers...');
  await bash.move({ parameters: [options.workspaceDir, options.backupsDir] }).exec();
}
