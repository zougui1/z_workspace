import path from 'path';

import fs from 'fs-extra';

import { logger } from '@zougui/logger';
import { bash, RsyncInfo } from '@zougui/bash';

import { CopyInput, CopiedInput } from './logs';
import { ProgressBars } from './enums';
import { Source, BackupOptions } from './types';

const copy = async (input: string, output: string, options: BackupOptions, excludes?: string[]): Promise<void> => {
  const showProgressBar = options.progressBars.includes(ProgressBars.copy);

  const rsync = bash.rsync({
    exclude: excludes,
    recursive: true,
    archive: true,
    info: showProgressBar ? RsyncInfo.progress2 : RsyncInfo.none,
    parameters: [input, output],
  });

  await rsync.exec();
}

const copySource = async (source: Source, originalSource: Source | undefined, options: BackupOptions) => {
  const copyToRoot = originalSource?.inputs.length === 1;
  const copyOutput = copyToRoot ? options.workspaceDir : path.join(options.workspaceDir, source.label);

  for (const input of source.inputs) {
    logger.info(new CopyInput({ source, input }));

    await fs.ensureDir(copyOutput);
    await copy(input, copyOutput, options, source.excludes);

    logger.info(new CopiedInput({ source, input }));
    logger.line();
  }
}

export const copyInputsToWorkspace = async (sources: Source[], originalSources: Source[], options: BackupOptions) => {
  for (const source of sources) {
    const originalSource = originalSources.find(s => source.label === s.label);
    await copySource(source, originalSource, options);
  }
}
