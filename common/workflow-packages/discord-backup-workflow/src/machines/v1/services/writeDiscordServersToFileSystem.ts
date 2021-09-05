import Discord from 'discord.js';
import path from 'path';
import fs from 'fs-extra';

import { safelySetActivity } from '@zougui/discord';

import { BackupOptions, ServerObject } from '../types';

export const writeDiscordServersToFileSystem = async (client: Discord.Client, servers: ServerObject[], options: BackupOptions) => {
  safelySetActivity(client.user, 'Backing-up servers...');

  await fs.ensureDir(options.workspaceDir);
  await Promise.all(servers.map(server => writeServer(server, options.workspaceDir)));
}

const writeServer = async (server: ServerObject, workspaceDir: string) => {
  const serverBackupFile = path.join(workspaceDir, `${server.name}.json`);
  await fs.writeFile(serverBackupFile, JSON.stringify(server));
}
