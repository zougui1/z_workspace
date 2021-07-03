import { BashCommand } from '../BashCommand';
import { BashStdout } from '../BashStdout';

export const zstd = new BashCommand<ZstdArgs, string>('zstd', 'compress the input');

export interface ZstdArgs {
  'exclude-compressed'?: boolean;
  'T#'?: number;
  stdout?: BashStdout;
}
