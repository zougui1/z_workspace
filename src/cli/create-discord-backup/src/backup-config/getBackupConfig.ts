import { getConfig } from '@zougui/user-config-file';

import { normalizeBackupConfig } from './normalizeBackupConfig';
import { backupConfigSchema } from './backupConfigSchema';
import { IBackupConfig } from './backup-config-types';

export const getBackupConfig = async (): Promise<IBackupConfig> => {
  return await getConfig({
    schema: backupConfigSchema,
    normalize: normalizeBackupConfig,
  });
}
