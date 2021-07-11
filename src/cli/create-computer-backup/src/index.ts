import './startup';
import { Command, Option } from 'commander';

import { threadManager } from '@zougui/thread-manager';
import { logger } from '@zougui/logger';
import { transactionContext } from '@zougui/transaction-context';
import { computerBackupMachine } from '@zougui/computer-backup-workflow';

import { createBackup } from './commands/create';
import { BackupErrorLog } from './logs';

const program = new Command();

const reasonOption = new Option('-r, --reason <string>', 'the reason why this command is executed')
  .default(computerBackupMachine.Reasons.manual)
  .choices([
    computerBackupMachine.Reasons.manual,
    computerBackupMachine.Reasons.boot,
    computerBackupMachine.Reasons.packageInstall,
    computerBackupMachine.Reasons.packageUpgrade,
    computerBackupMachine.Reasons.packageRemove,
  ]);

const progressBarsOption = new Option('-p, --progress <string...>', 'the progress bars to display')
  .default([computerBackupMachine.ProgressBars.copy, computerBackupMachine.ProgressBars.compression])
  .choices([
    computerBackupMachine.ProgressBars.copy,
    computerBackupMachine.ProgressBars.compression,
    computerBackupMachine.ProgressBars.none,
  ]);

program
  .command('create')
  .description('create a backup from the configuration file')
  .addOption(reasonOption)
  .addOption(progressBarsOption)
  .action(async (options) => {
    const transaction = {
      label: 'Create a computer backup',
      topics: ['backup', 'filesystem'],
      data: {},
    };

    try {
      await transactionContext.run(transaction, () => createBackup(options));
      threadManager.waitToExit(0, { forceTimeout: 1000 });
    } catch (error) {
      logger.error(new BackupErrorLog({ error }));
      threadManager.waitToExit(1, { forceTimeout: 1000 });
    }
  });

program.version('1.0.0');
program.parse();
