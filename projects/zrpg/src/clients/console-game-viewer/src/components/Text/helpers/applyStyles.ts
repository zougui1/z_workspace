import chalk from 'chalk';

import { colorize } from './colorize';

export const applyStyles = (text: string | number | undefined, styles: Record<string, any>): string => {
  text ??= '';
  text = colorize(text, styles.color);
  text = colorize(text, styles.backgroundColor, 'bg');

  for (const [key, value] of Object.entries(styles)) {
    if (value === true) {
      const effect = (chalk as any)[key];

      if (typeof effect === 'function') {
        const textEffect: any = effect(text);

        if (typeof textEffect === 'string') {
          text = textEffect;
        }
      }
    }
  }

  return text;
}
