import { BashCommand } from '../BashCommand';

export const rm = new BashCommand<RmArgs, string>('rm', 'remove the input');

rm.setAliases({
  recursive: 'r',
  force: 'f',
});

export interface RmArgs {
  recursive?: boolean;
  force?: boolean;
  parameters: [string];
}
