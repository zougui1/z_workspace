import prettyJson from 'prettyjson';
import { Exception } from '@zougui/error';

import { List, formatList as listToString } from '../log-utils';

export const formatMessage = (message: any): string => {
  if (!message || typeof message !== 'object') {
    return String(message);
  }

  if (message instanceof Exception) {
    const label = `[Exception ${message.constructor.name}]`;
    const messageParagraph = `message: ${formatMessage(message.message)}`;
    const detailsParagraph = `details: ${formatMessage(message.details)}`;

    const text = message.details
      ? `${messageParagraph}\n${detailsParagraph}`
      : messageParagraph;

    return `${label}\n${text}`;
  }

  if (message instanceof List) {
    return formatList(message);
  }

  const prettyMessage = prettyJson.render(message);
  return `[JSON ${message.constructor.name}]:\n${prettyMessage}`;
}

const formatList = (list: List<any>): string => {
  return listToString(list.label, list.items.map(item => formatMessage(item)));
}
