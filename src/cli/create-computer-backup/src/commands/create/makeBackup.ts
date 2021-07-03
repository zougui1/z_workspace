import fs from 'fs-extra';
import path from 'path';
import { logger } from '@zougui/logger';
import { bash, RsyncInfo } from '@zougui/bash';
import { Stopwatch } from '@zougui/stopwatch';

import { CopyInput, CopiedInput, CompressInput, CompressedInput } from './logs';
import { Backup } from '../../backup-config';

export const makeBackup = async (backup: Backup, workspaceDir: string, stopwatch: Stopwatch, options: IMakeBackupOptions): Promise<void> => {
  const copyToRoot = backup.inputs.length === 1;
  const copyOutput = copyToRoot ? workspaceDir : path.join(workspaceDir, backup.label);

  const backupLabelRoot = backup.label.split('/')[0];
  const compressInput = path.join(workspaceDir, backupLabelRoot);
  const compressOutput = path.join(workspaceDir, `${backupLabelRoot}.tar.zst`);

  for (const input of backup.inputs) {
    logger.info(new CopyInput({ backup, input }));
    await copy(input, copyOutput, backup);
    logger.info(new CopiedInput({ backup, input }));
  }
  stopwatch.lap('copy');

  logger.line();

  logger.info(new CompressInput({ backup }));
  await compress(compressInput, compressOutput, options.threads);
  logger.info(new CompressedInput({ backup }));
  stopwatch.lap('compress');

  logger.line();
}

export const copy = async (input: string, output: string, backup: Backup): Promise<void> => {
  await fs.ensureDir(output);
  const rsync = bash.rsync({
    exclude: backup.excludes,
    recursive: true,
    archive: true,
    info: RsyncInfo.progress2,
    parameters: [input, output],
  });

  await rsync.exec();
}

const compress = async (input: string, output: string, threads: number): Promise<void> => {
  await fs.ensureDir(path.dirname(output));
  const label = path.basename(input);

  const compress = bash.compress({
    input,
    output,
    threads,
    progressBar: {
      label,
    },
    autoRemove: true,
  });

  await compress.exec();
}

export interface IMakeBackupOptions {
  threads: number
}
