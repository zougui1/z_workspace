import { normalizeLoggerConfig } from '@zougui/logger';
import parseDuration from 'parse-duration'

import { IRawConfig, IConfig } from './config-types';

const normalizeDuration = (duration: string | number): number => {
  const durationMilliseconds = typeof duration === 'number'
    ? duration
    : parseDuration(duration);

  if (typeof durationMilliseconds !== 'number') {
    throw new Error(`the duration "${duration}" could not be parsed.`);
  }

  return durationMilliseconds;
}

export const normalizeConfig = (rawConf: unknown): IConfig => {
  const rawConfig = rawConf as IRawConfig;

  return {
    ...rawConfig,
    browse: {
      ...rawConfig.browse,
      fetchSubmissionInterval: normalizeDuration(rawConfig.browse.fetchSubmissionInterval),
      on: {
        ...rawConfig.browse.on,
        interval: normalizeDuration(rawConfig.browse.on.interval),
      },
    },
    discord: {
      ...rawConfig.discord,
      loginTimeout: normalizeDuration(rawConfig.discord.loginTimeout),
    },
    logs: normalizeLoggerConfig(rawConfig.logs),
  };
}
