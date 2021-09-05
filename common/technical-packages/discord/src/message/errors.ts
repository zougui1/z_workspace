import { ValidationResult } from 'joi';

import { Exception } from '@zougui/error';
import { formatList } from '@zougui/utils';

export interface InvalidJsonMessageErrorData {
  validation: ValidationResult;
  message: {
    createdAt: Date;
    updatedAt: Date | null;
    author: string;
    channel?: string;
    dm?: string;
    server?: string;
  };
}

export const InvalidJsonMessageError = new Exception<InvalidJsonMessageErrorData>()
  .setCode('discord.messages.config.json.invalid')
  .setStatus(400)
  .setMessage((data) => formatList('Invalid config:', data.validation.error?.details.map(detail => detail.message) || []))
  .toClass();
