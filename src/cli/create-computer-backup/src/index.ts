import './startup';
import { Command, Option } from 'commander';
import { threadManager } from '@zougui/thread-manager';
import { logger } from '@zougui/logger';

import { createBackup, Reasons } from './commands/create';
import { BackupErrorLog } from './logs';

const program = new Command();

const reasonOption = new Option('-r, --reason <string>', 'the reason why this command is executed')
  .default(Reasons.manual)
  .choices([
    Reasons.manual,
    Reasons.boot,
    Reasons.packageInstall,
    Reasons.packageUpgrade,
    Reasons.packageRemove,
  ]);

program
  .command('create')
  .description('create a backup from the configuration file')
  .addOption(reasonOption)
  .action(async (options) => {
    try {
      await createBackup(options);
    } catch (error) {
      logger.error(new BackupErrorLog({ error }));
    } finally {
      threadManager.waitToExit(0, { forceTimeout: 1000 });
    }
  });

program.version('1.0.0');
program.parse();
