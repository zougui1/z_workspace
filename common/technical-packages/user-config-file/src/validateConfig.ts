import { ObjectSchema } from 'joi';
import { logger } from '@zougui/logger';

import { ConfigValidationErrorLog } from './logs';
import { InvalidConfigFileError } from './errors';

export const validateConfig = (config: unknown, schema: ObjectSchema): unknown => {
  const validation = schema.validate(config, { abortEarly: false });

  if (validation.error) {
    const exception = new InvalidConfigFileError({ validationError: validation.error });
    logger.error(new ConfigValidationErrorLog({ error: exception }));
    throw exception;
  }

  return validation.value;
}
