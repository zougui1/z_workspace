import { ObjectSchema } from 'joi';
import { logger, List, ExitScope } from '@zougui/logger';
import { Exception } from '@zougui/error';

import { ConfigValidationErrorLog } from './logs';

export const validateConfig = (config: unknown, schema: ObjectSchema): unknown => {
  const validation = schema.validate(config, { abortEarly: false });

  if (validation.error) {
    const messages = validation.error.details.map(detail => detail.message);
    const exception = new Exception('The config is invalid', 'ERR_INVALID_CONFIG', new List('', messages));
    logger.error(new ConfigValidationErrorLog({ error: exception }));
    throw new ExitScope('config-validate', exception);
  }

  return validation.value;
}
