import { bash } from '@zougui/bash';

import { requiredPackageManegementCommands } from '../../package-manager';

export const requiredBackupCreationCommands = [
  bash.commands.rsync,
  bash.commands.tar,
  bash.commands.pigz,
  bash.commands.pv,
  bash.commands.du,
  bash.commands.awk,
  bash.commands.rm,
  ...requiredPackageManegementCommands,
];
