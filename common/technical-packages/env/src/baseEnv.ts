import path from 'path';
import { get } from 'env-var';

export const APP_NAME = get('npm_package_name').default('unknown-app-name').asString();
export const APP_VERSION = get('npm_package_version').default('0.0.0').asString();
export const NODE_ENV = get('NODE_ENV').default('development').asString();
export const WORKSPACE = '/mnt/Manjaro_Data/zougui/workspace/';
export const APP_WORKSPACE = path.join(WORKSPACE, APP_NAME);
