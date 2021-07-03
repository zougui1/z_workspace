import { Command } from 'commander';
import { threadManager } from '@zougui/thread-manager';
import { logger } from '@zougui/logger';

import { copyLastBackups } from './commands/copy-last-backups';
import { CopyBackupErrorLog } from './logs';

const program = new Command();

program
  .command('copy')
  .description('copy the last backups available into backup partitions when they are plugged in')
  .action(async () => {
    try {
      await copyLastBackups();
    } catch (error) {
      logger.error(new CopyBackupErrorLog({ error }));
    } finally {
      threadManager.waitToExit(0, { forceTimeout: 1000 });
    }
  });

program.version('1.0.0');
program.parse();
