import { logApi } from './logApi';

export const log = async (message: any) => {
  await logApi.post('/logs', { message });
}
