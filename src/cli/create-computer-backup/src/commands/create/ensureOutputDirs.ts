import fs from 'fs-extra';

import { IBackupConfig } from '../../backup-config';

export const ensureOutputDirs = async (config: IBackupConfig): Promise<void> => {
  await Promise.all([
    fs.ensureDir(config.workspaceDir),
    fs.ensureDir(config.backupsDir),
  ]);
}
