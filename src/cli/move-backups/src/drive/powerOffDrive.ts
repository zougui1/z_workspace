import { bash, UdisksctlCommand } from '@zougui/bash';

export const powerOffDrive = async (pathName: string): Promise<void> => {
  await bash.udisksctl({ command: UdisksctlCommand.powerOff, 'block-device': pathName }).exec();
}

export const powerOffDriveRequiredCommands = [bash.commands.udisksctl];
