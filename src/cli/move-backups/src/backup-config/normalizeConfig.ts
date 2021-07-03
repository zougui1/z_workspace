import { normalizeLoggerConfig } from '@zougui/logger';

import { IRawConfig, IConfig } from './config-types';

export const normalizeConfig = (rawConf: unknown): IConfig => {
  const rawConfig = rawConf as IRawConfig;

  return {
    ...rawConfig,
    logs: normalizeLoggerConfig(rawConfig.logs),
  };
}
