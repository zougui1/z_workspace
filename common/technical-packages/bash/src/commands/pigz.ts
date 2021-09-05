import { BashCommand } from '../BashCommand';
import { BashStdout } from '../BashStdout';

export const pigz = new BashCommand<PigzArgs, string>('pigz', 'compress the input');

pigz.setAliases({
  processes: 'p',
});

export interface PigzArgs {
  processes?: number;
  stdout: BashStdout;
}
