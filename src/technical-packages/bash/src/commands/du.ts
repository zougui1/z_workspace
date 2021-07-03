import { BashCommand } from '../BashCommand';

export const du = new BashCommand<DuArgs, string>('du', 'compute the size of `input`');

du.setAliases({
  summarize: 's',
  bytes: 'b',
})

export interface DuArgs {
  summarize?: boolean;
  bytes?: boolean;
  parameters: [string];
}
