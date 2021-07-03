import { Exception } from '@zougui/error';

import { List } from '../log-utils';

export const formatMessage = (message: any): any => {
  if (!message || typeof message !== 'object') {
    return String(message);
  }

  if (message instanceof Exception) {
    return {
      exception: `[${message.constructor.name}]`,
      message: formatMessage(message.message),
      details: formatMessage(message.details),
      stack: message.stack,
    };
  }

  if (message instanceof List) {
    return formatList(message);
  }

  return JSON.stringify(message, null, 2);
}

const formatList = (list: List<any>): { label: string; items: any[] } => {
  return {
    label: list.label,
    items: list.items.map(formatMessage),
  };
}
