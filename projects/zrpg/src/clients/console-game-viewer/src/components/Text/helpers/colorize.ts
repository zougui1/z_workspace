import _ from 'lodash';
import chalk from 'chalk';
import isHexColor from 'is-hexcolor';

export const colorize = (text: string | number, color: string | undefined | boolean, suffix?: string): string => {
  const chalkFnName = _.camelCase([suffix, color].filter(str => str).join('_'));

  const colorizer = typeof color === 'string'
    ? isHexColor(color)
      ? chalk.hex(color)
      : typeof (chalk as any)[chalkFnName] === 'function'
        ? (chalk as any)[chalkFnName]
        : undefined
    : undefined;

  return colorizer ? colorizer(text) : text;
}
