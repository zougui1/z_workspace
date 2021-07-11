import { pacman } from '@zougui/package-manager';
import { computerBackupMachine } from '@zougui/computer-backup-workflow';

import { IBackupConfig } from '../../backup-config';

export const getBackupCause = async (config: IBackupConfig, reason: computerBackupMachine.Reasons): Promise<string[] | undefined> => {
  switch (reason) {
    case computerBackupMachine.Reasons.packageInstall:
    case computerBackupMachine.Reasons.packageUpgrade:
    case computerBackupMachine.Reasons.packageRemove:
      return await pacman.getUpdatedPackageNames({ timeout: config.packagesStdinTimeout });
  }
}
