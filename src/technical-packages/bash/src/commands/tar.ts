import { BashCommand } from '../BashCommand';
import { BashSubCommand } from '../BashSubCommand';

export const tar = new BashCommand<TarArgs, string>('tar', 'put the `input` into a tarball');

tar.setAliases({
  create: 'c',
  file: 'f',
  'absolute-names': 'P',
  'use-compress-program': 'I',
});

export interface TarArgs {
  create?: boolean;
  file: [string, string];
  'absolute-names'?: boolean;
  'use-compress-program'?: BashSubCommand;
}
