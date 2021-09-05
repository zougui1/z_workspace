import { BashCommand } from '../BashCommand';
import { BashSubCommand } from '../BashSubCommand';

export const udevadm = new BashCommand<UdevadmArgs, string>('udevadm', 'get data from the udev datanase');

export type UdevadmArgs = UdevadmInfoArgs;

export interface UdevadmInfoArgs {
  command: UdevadmCommand;
  'attribute-walk'?: boolean;
  path?: string | BashSubCommand | typeof udevadm;
  query?: UdevadmCommandInfoQueryType;
  name?: string;
}

export enum UdevadmCommand {
  info = 'info',
}

export enum UdevadmCommandInfoQueryType {
  path = 'path',
}
