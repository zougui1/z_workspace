import { bash } from '@zougui/bash';

import { mountingRequiredCommands, powerOffDriveRequiredCommands } from '../../drive';

export const requiredCopyBackupCommands = [
  bash.commands.rsync,
  ...mountingRequiredCommands,
  ...powerOffDriveRequiredCommands,
];
