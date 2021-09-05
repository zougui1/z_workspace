import Joi from 'joi';
import os from 'os';
import { loggerConfigSchema } from '@zougui/logger';

const rePercentage = /^(?!0+%)(?:\d|[1-9]\d|100)(?:(?<!100))?%$/;

const actionSchema = Joi.object({
  threads: Joi.alternatives().try(
    Joi.number().integer().min(1).max(os.cpus().length),
    Joi.string().pattern(rePercentage, { name: 'percentage' }),
  ).required(),
});

const externalBackupPartitionsSchema = Joi.array().items(
  Joi.object({
    mountPoint: Joi.string().min(3).max(100).required(),
    device: Joi.object({
      partuuid: Joi.string().min(3).max(100).required(),
    }).required(),
  })
).required();

const filesystemSchema = Joi.object({
  excludes: Joi.array().items(Joi.string()),

  reasons: Joi.object({
    manual: actionSchema,
    boot: actionSchema,
    packageInstall: actionSchema,
    packageUpgrade: actionSchema,
    packageRemove: actionSchema,
  }).required(),

  backups: Joi.array()
    .items(
      Joi.object({
        label: Joi.string().min(3).max(100).required(),
        input: Joi.string(),
        inputs: Joi.array().items(Joi.string()),
        required: Joi.boolean(),
        excludes: Joi.array().items(Joi.string()),
      }).xor('input', 'inputs')
    )
    .required(),
}).required();

const discordSchema = Joi.object({
  prefix: Joi.string().min(1).max(10).required(),
});

export const backupConfigSchema = Joi.object({
  workspaceDir: Joi.string().required(),
  backupsDir: Joi.string().required(),
  dateFormat: Joi.string().required(),
  backupDirFormat: Joi.string().required(),
  packagesStdinTimeout: Joi.number().integer().positive().required(),

  externalBackupPartitions: externalBackupPartitionsSchema,
  logs: loggerConfigSchema,
  filesystem: filesystemSchema,
  discord: discordSchema,
});
