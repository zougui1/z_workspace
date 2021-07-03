import Joi from 'joi';
import os from 'os';
import { loggerConfigSchema } from '@zougui/logger';

const rePercentage = /^(?!0+%)(?:\d|[1-9]\d|100)(?:(?<!100))?%$/;

const percentageSchema = Joi.string().pattern(rePercentage, { name: 'percentage' });

const threadsSchema = Joi.alternatives().try(
  Joi.number().integer().min(1).max(os.cpus().length),
  percentageSchema,
);

const discordSchema = Joi.object({
  token: Joi.string().min(10).required(),
  prefix: Joi.string().min(1).max(10).required(),
  loginTimeout: Joi.number().integer().positive().required(),
});

export const backupConfigSchema = Joi.object({
  workspaceDir: Joi.string().required(),
  backupsDir: Joi.string().required(),
  dateFormat: Joi.string().required(),
  backupDirFormat: Joi.string().required(),

  threads: threadsSchema,
  logs: loggerConfigSchema,
  discord: discordSchema,
});
