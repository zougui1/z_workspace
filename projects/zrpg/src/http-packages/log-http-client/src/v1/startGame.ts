import { logApi } from './logApi';

export const startGame = async (pid = process.pid) => {
  await logApi.post('/logs/start', { pid });
}
