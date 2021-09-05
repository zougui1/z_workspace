import axios, { AxiosError } from 'axios';

import { LOG_SERVER_HOST } from '../env';

export const logApi = axios.create({
  baseURL: `${LOG_SERVER_HOST}/api/v1`,
});

logApi.interceptors.response.use(undefined, error => {
  try {
    if (error.isAxiosError) {
      const aError = error as AxiosError;
      const errorJson = aError.toJSON() as any;

      const url = [errorJson.config.baseURL, errorJson.config.url].filter(p => p).join('');

      console.group('HTTP error');
      console.log('request:', errorJson.config.method.toUpperCase(), url);
      console.log(errorJson.stack || errorJson.message || errorJson);
      console.groupEnd();
    } else {
      console.log(error.stack || error.message || error);
    }
  } catch (error) {
    console.log('Error interceptor error:', error);
  }
});
