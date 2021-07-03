import { Exception } from '@zougui/error';

import { List } from '../log-utils';

const spacePerIndent = 2;

export const formatMessage = (message: any): string => {
  if (!message || typeof message !== 'object') {
    return String(message);
  }

  if (message instanceof Exception) {
    const label = `[Exception ${message.constructor.name}]`;
    const messageParagraph = `message: ${formatMessage(message.message)}`;
    const detailsParagraph = `details: ${formatMessage(message.details)}`;
    const text = `${messageParagraph}\n${detailsParagraph}`;

    return `${label}\n${text}`;
  }

  if (message instanceof List) {
    return formatList(message);
  }

  return JSON.stringify(message, null, 2);
}

const formatList = (list: List<any>): string => {
  return formatList2(list.label, list.items.map(item => formatMessage(item)));
}

export const indent = (text: string, level: number = 1): string => {
  const spaceIndent = ' '.repeat(level * spacePerIndent);
  const indentation = `-${spaceIndent}`;

  return text
    .split('\n')
    .map(line => `${indentation}${line}`)
    .join('\n');
}

export const formatList2 = (label: string, items: string[]): string => {
  return `${label}\n${indent(items.join('\n'))}`;
}
