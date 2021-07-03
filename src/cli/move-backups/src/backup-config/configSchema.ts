import Joi from 'joi';
import { loggerConfigSchema } from '@zougui/logger';

const externalBackupPartitionsSchema = Joi.array().items(Joi.string());

export const configSchema = Joi.object({
  backupsDirs: Joi.array().items(Joi.string().required()),
  dateFormat: Joi.string().required(),
  backupDirFormat: Joi.string().required(),

  externalBackupPartitions: externalBackupPartitionsSchema.required(),
  logs: loggerConfigSchema,
});
