import { BashCommand } from '../BashCommand';

export const udisksctl = new BashCommand<UdisksctlArgs, string>('udisksctl', 'performs actions on disks');

udisksctl.setAliases({
  'block-device': 'b',
})

export type UdisksctlArgs = UdisksctlPowerOffArgs;

export interface UdisksctlPowerOffArgs {
  command: UdisksctlCommand.powerOff;
  'block-device': string;
}

export enum UdisksctlCommand {
  powerOff = 'power-off',
}
