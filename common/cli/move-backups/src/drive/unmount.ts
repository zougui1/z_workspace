import { bash } from '@zougui/bash';

export const unmount = async (devicePath: string): Promise<void> => {
  await bash.umount({ parameters: [devicePath] }).exec();
}

export const mountingRequiredCommands = [bash.commands.umount];
