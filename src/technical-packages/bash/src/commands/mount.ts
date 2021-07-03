import { BashCommand } from '../BashCommand';

export const mount = new BashCommand<MountArgs, string>('mount', 'mount a partition');

export interface MountArgs {
  parameters: [string, string];
  sudo?: boolean;
}
