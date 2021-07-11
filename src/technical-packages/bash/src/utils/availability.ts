import commandExists from 'command-exists';
import { logger } from '@zougui/logger';

import { BashCommand } from '../BashCommand';
import { MissingManyCommandsError } from '../errors';
import { MissingManyCommandsLog } from '../logs';

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
    const error = new MissingManyCommandsError({ commands: missingCommands });
    logger.error(new MissingManyCommandsLog({ error, commands: missingCommands }));
    throw error;
  }
}
