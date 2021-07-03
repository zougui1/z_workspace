import { BashCommand } from '../BashCommand';

export const move = new BashCommand<MoveArgs, string>('mv', 'move `source` into `destination`');

export interface MoveArgs {
  parameters: [string, string];
}
