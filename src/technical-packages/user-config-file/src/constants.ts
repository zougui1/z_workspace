import path from 'path';
import os from 'os';
import env from '@zougui/env';

export const CONFIG_PATH = path.join(os.homedir(), '.config', `${env.PROJECT_NAME}.json`);
