import { BashCommand } from '../BashCommand';
import { BashEnvVar } from '../BashEnvVar';

export const pv = new BashCommand<PvArgs, string>('pv', 'show a progress bar of the input stream');

pv.setAliases({
  name: 'N',
  size: 's',
});

export interface PvArgs {
  name?: string;
  size: BashEnvVar | string;
}
