import parseDuration from 'parse-duration'

import { IConfig } from './config-types';

const normalizeDuration = (duration: string | number): number => {
  const durationMilliseconds = typeof duration === 'number'
    ? duration
    : parseDuration(duration);

  if (typeof durationMilliseconds !== 'number') {
    throw new Error(`the duration "${duration}" could not be parsed.`);
  }

  return durationMilliseconds;
}

export const normalizeConfig = (rawConf: any): IConfig => {

  return {
    ...rawConf,
    browse: {
      ...rawConf.browse,
      fetchSubmissionInterval: normalizeDuration(rawConf.browse.fetchSubmissionInterval),
      on: {
        ...rawConf.browse.on,
        interval: normalizeDuration(rawConf.browse.on.interval),
      },
    },
    discord: {
      ...rawConf.discord,
      loginTimeout: normalizeDuration(rawConf.discord.loginTimeout),
    },
  };
}
