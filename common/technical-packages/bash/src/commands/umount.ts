import { BashCommand } from '../BashCommand';

export const umount = new BashCommand<UmountArgs, string>('umount', 'unmount a partition');

export interface UmountArgs {
  parameters: [string];
  sudo?: boolean;
}
