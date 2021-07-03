import { getConfig } from '../../../../technical-packages/user-config-file/lib';

import { configSchema } from './configSchema';
import { normalizeConfig } from './normalizeConfig';
import { IConfig } from './config-types';

export const getBackupConfig = async (): Promise<IConfig> => {
  return await getConfig({
    schema: configSchema,
    normalize: normalizeConfig,
  }) as IConfig;
}
