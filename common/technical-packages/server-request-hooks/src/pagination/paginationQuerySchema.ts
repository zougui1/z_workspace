import Joi from 'joi';

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

export const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(0).default(DEFAULT_PAGE),
  pageSize: Joi.number().integer().min(1).max(100).default(DEFAULT_PAGE_SIZE),
}).unknown(true);
