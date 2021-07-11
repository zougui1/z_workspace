import path from 'path';

import fs from 'fs-extra';

import { logger } from '@zougui/logger';
import { bash } from '@zougui/bash';

import { CompressSource, CompressedSource } from './logs';
import { ProgressBars } from './enums';
import { Source, BackupOptions } from './types';

const compress = async (input: string, output: string, options: BackupOptions) => {
  const label = path.basename(input);
  const showProgressBar = options.progressBars.includes(ProgressBars.compression);
  const progressBar = showProgressBar ? { label } : undefined;

  const compress = bash.compress({
    input,
    output,
    threads: options.threads,
    progressBar,
    autoRemove: true,
  });

  await compress.exec();
}

const compressSource = async (source: Source, options: BackupOptions) => {
  const backupLabelRoot = source.label.split('/')[0];
  const compressInput = path.join(options.workspaceDir, backupLabelRoot);
  const compressOutput = path.join(options.workspaceDir, `${backupLabelRoot}.tar.zst`);

  await fs.ensureDir(path.dirname(compressOutput));
  await compress(compressInput, compressOutput, options);
}

export const compressSources = async (sources: Source[], options: BackupOptions) => {
  for (const source of sources) {
    logger.info(new CompressSource({ source }));
    await compressSource(source, options);
    logger.info(new CompressedSource({ source }));
    logger.line();
  }
}
