import path from 'path';

export const LOG_CHANNEL_NAME = '__logs__';
export const LOGIN_TIMEOUT = 5000;
export const PROJECT_DIR = path.join(__dirname, '..');
export const REPO_ROOT_DIR = path.join(PROJECT_DIR, '../../..');
export const SOURCE_DIR = path.join(PROJECT_DIR, 'src');
export const BACKUP_CONFIG_PATH = path.join(REPO_ROOT_DIR, 'backup.config.json');
