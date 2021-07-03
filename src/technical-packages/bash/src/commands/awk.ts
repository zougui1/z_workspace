import { BashCommand } from '../BashCommand';

export const awk = new BashCommand<AwkArgs, string>('awk', 'format the input');

export interface AwkArgs {
  parameters: [string];
}
