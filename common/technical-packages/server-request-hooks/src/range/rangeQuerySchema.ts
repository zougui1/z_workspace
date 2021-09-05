import Joi from 'joi';

const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 10;

export const rangeQuerySchema = Joi.object({
  skip: Joi.number().integer().min(0).default(DEFAULT_SKIP),
  limit: Joi.number().integer().min(1).max(100).default(DEFAULT_LIMIT),
}).unknown(true);
