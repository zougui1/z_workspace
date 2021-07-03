import { IBackupConfig } from '../../backup-config';
import { Reasons } from './Reasons';
import { getUpdatedPackageNames } from '../../package-manager';

export const getBackupCause = async (config: IBackupConfig, reason: Reasons): Promise<string[] | undefined> => {
  switch (reason) {
    case Reasons.packageInstall:
    case Reasons.packageUpgrade:
    case Reasons.packageRemove:
      return await getUpdatedPackageNames({ timeout: config.packagesStdinTimeout });
  }
}
