import commandExists from 'command-exists';
import { logger, List, ExitScope } from '@zougui/logger';

import { BashCommand } from '../BashCommand';

export const areAvailableOrFail = async (commands: (string | BashCommand<any>)[]): Promise<void> => {
  const availables = await Promise.all(commands.map(async command => {
    try {
      await commandExists(typeof command === 'string' ? command : command.name);
      return true;
    } catch (error) {
      return false;
    }
  }));

  const missingCommands = availables
    .map((available, i) => !available ? commands[i] : undefined)
    .filter(command => command) as string[];


  if (missingCommands.length) {
    const message = new List('The following commands are missing and must be installed:', missingCommands);
    logger.error(message);
    throw new ExitScope('missing-command', message);
  }
}
