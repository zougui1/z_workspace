import path from 'path';

import fs from 'fs-extra';

import { logger } from '@zougui/logger';
import { getPrettyFolderSize } from '@zougui/fs-utils';
import { pacman } from '@zougui/package-manager';

import { ComputingInputSize, ComputedInputSize } from './logs';
import { Source, BackupOptions } from './types';

const getInputs = (sources: Source[]): { input: string; source: Source }[] => {
  const inputs = sources.flatMap(source => {
    return source.inputs.map(input => {
      return {
        source,
        input,
      };
    });
  });

  return inputs;
}

const computeInputSize = async (source: Source, input: string): Promise<string> => {
  logger.info(new ComputingInputSize({ source, input }));
  const size = await getPrettyFolderSize(input);
  logger.info(new ComputedInputSize({ source, input }));

  return size;
}

const computeInputsSize = async (inputs: { input: string; source: Source }[], workspaceDir: string): Promise<Sizes> => {
  const sizes: Sizes = {};

  await Promise.all(inputs.map(async ({ source, input }) => {
    const backupLabelRoot = source.label.split('/')[0];
    const outputPath = path.join(workspaceDir, `${backupLabelRoot}.tar.zst`);

    sizes[source.label] ??= {};
    sizes[source.label][input] ??= await computeInputSize(source, input);
    sizes[source.label][source.label] = await computeInputSize(source, outputPath);
  }));

  return sizes;
}

const getBackupLog = (sources: Source[], originalSources: Source[], sizes: Sizes) => {
  const sourcesLog = originalSources.reduce((sourcesLog, source) => {
    const includedSource = sources.find(includedSource => includedSource.label === source.label);

    const inputs = source.inputs.reduce((inputs, input) => {
      return {
        ...inputs,
        [input]: {
          included: includedSource?.inputs.some(includedInput => includedInput === input) ?? false,
          size: sizes[source.label]?.[input] ?? 'unknown',
        },
      };
    }, {} as any);

    return {
      ...sourcesLog,
      [source.label]: {
        compressedSize: sizes[source.label],
        inputs,
      },
    };
  }, {} as any);

  return sourcesLog;
}

export const createBackupLog = async (sources: Source[], originalSources: Source[], options: BackupOptions) => {
  const inputs = getInputs(sources);
  const sizes = await computeInputsSize(inputs, options.workspaceDir);
  const sourcesLog = getBackupLog(sources, originalSources, sizes);
  const packages = await pacman.getPackagesList();

  const log = {
    dateFormat: options.backup.dirFormat,
    date: options.backup.date,
    reason: {
      label: options.reason.type,
      causedBy: options.reason.packages,
    },
    sources: sourcesLog,
    packages,
  };

  const backupLogPath = path.join(options.workspaceDir, 'backup-log.json');

  await fs.writeFile(backupLogPath, JSON.stringify(log, null, 2));
}

type Sizes = Record<string, Record<string, string>>
