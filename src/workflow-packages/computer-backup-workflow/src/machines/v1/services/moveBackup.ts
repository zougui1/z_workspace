import { bash } from '@zougui/bash';

import { BackupOptions } from './types';

export const moveBackup = async (options: BackupOptions) => {
  await bash.move({ parameters: [options.workspaceDir, options.backupsDir] }).exec();
}
