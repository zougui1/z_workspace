import { indent } from '@zougui/utils';

export const formatList = (label: string, items: string[]): string => {
  return `${label}\n${indent(items.join('\n'))}`;
}
