import Discord from 'discord.js';
import fs from 'fs-extra';
import moment from 'moment';
import path from 'path';
import { logger, ExitScope } from '@zougui/logger';
import { bash } from '@zougui/bash';

import { getServersToBackup } from './getServersToBackup';
import { IServerBackup } from './create-backup-types';
import { SetUserActivityErrorLog, GetServersErrorLog } from './logs';
import { IBackupConfig } from '../backup-config';

export const createBackup = async (client: Discord.Client, config: IBackupConfig) => {
  const backupDate = moment();

  client.user
    ?.setActivity('Creating a backup...')
    .catch(error => logger.error(new SetUserActivityErrorLog({ error })));

  let servers: IServerBackup[];

  try {
    servers = await getServersToBackup(client, config);
  } catch (error) {
    const errorLog = new GetServersErrorLog({ error });
    logger.error(errorLog);
    throw new ExitScope('create-backup', errorLog);
  } finally {
    client.user
      ?.setActivity('Creating a backup...')
      .catch(error => logger.error(new SetUserActivityErrorLog({ error })));
  }

  const backupDirName = backupDate.format(config.backupDirFormat);
  const workspaceDir = path.join(config.workspaceDir, backupDirName);
  await fs.ensureDir(workspaceDir);

  await Promise.all(servers.map(async server => {
    const serverBackupFile = path.join(workspaceDir, `${server.name}.json`);
    await fs.writeFile(serverBackupFile, JSON.stringify(server));
  }));

  await Promise.all(servers.map(async server => {
    const serverBackupFile = path.join(workspaceDir, `${server.name}.json`);
    const compressedServerBackupFile = path.join(workspaceDir, `${server.name}.tar.zstd`);
    await compress(serverBackupFile, compressedServerBackupFile, config.threads);
  }));

  const backupsDir = path.join(config.backupsDir, backupDirName);
  await bash.move({ parameters: [workspaceDir, backupsDir] }).exec();
}

const compress = async (input: string, output: string, threads: number): Promise<void> => {
  await fs.ensureDir(path.dirname(output));
  const label = path.basename(input);

  const compress = bash.compress({
    input,
    output,
    threads,
    progressBar: {
      label,
    },
    autoRemove: true,
  });

  await compress.exec();
}
