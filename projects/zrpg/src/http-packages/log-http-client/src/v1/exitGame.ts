import { logApi } from './logApi';

export const exitGame = async () => {
  await logApi.post('/logs/exit');
}
