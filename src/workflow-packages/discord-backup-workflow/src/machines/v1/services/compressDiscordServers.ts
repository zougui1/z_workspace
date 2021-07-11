import Discord from 'discord.js';
import path from 'path';
import fs from 'fs-extra';

import { safelySetActivity } from '@zougui/discord';
import { bash } from '@zougui/bash';

import { BackupOptions, ServerObject } from '../types';

export const compressDiscordServers = async (client: Discord.Client, servers: ServerObject[], options: BackupOptions) => {
  safelySetActivity(client.user, 'Compressing backed-up servers...');
  await Promise.all(servers.map(server => compressServer(server, options)));
}


const compressServer = async (server: ServerObject, options: BackupOptions) => {
  const serverBackupFile = path.join(options.workspaceDir, `${server.name}.json`);
  const compressedServerBackupFile = path.join(options.workspaceDir, `${server.name}.tar.zst`);

  await fs.ensureDir(path.dirname(compressedServerBackupFile));
  await compress(serverBackupFile, compressedServerBackupFile, options.threads);
}

const compress = async (input: string, output: string, threads: number): Promise<void> => {
  const compress = bash.compress({
    input,
    output,
    threads,
    autoRemove: true,
  });

  await compress.exec();
}
