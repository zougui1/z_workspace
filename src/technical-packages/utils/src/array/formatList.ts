import { indent } from '../string';

export const formatList = (label: string, items: string[]): string => {
  return `${label}\n${indent(items.join('\n'))}`;
}
