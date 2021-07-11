import { getConfig as getConf } from '@zougui/user-config-file';

import { normalizeConfig } from './normalizeConfig';
import { configSchema } from './configSchema';
import { IConfig } from './config-types';

export const getConfig = async (): Promise<IConfig> => {
  return await getConf({
    schema: configSchema,
    normalize: normalizeConfig,
  });
}
