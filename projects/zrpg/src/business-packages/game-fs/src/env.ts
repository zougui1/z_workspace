import path from 'path';

import env from '@zougui/env';

export const gameDataDir = env.get('GAME_DATA_DIR').required().asString();
export const gameSavesDir = path.join(gameDataDir, 'saves');
