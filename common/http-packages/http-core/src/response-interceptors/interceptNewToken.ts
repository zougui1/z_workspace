import { AxiosError } from 'axios';

import { ResponseInterceptor } from '../types';

export const interceptNewToken = (options: InterceptNewTokenOptions): ResponseInterceptor => {
  return {
    onResolved: response => {
      const newToken = response.headers['access-token'];

      if (newToken) {
        options.onAuthorized(newToken);
      }

      return response;
    },

    onRejected: async (error: AxiosError): Promise<void> => {
      if (error.response?.data.code === 401) {
        options.onUnauthorized();
      }

      throw error;
    },
  };
};

export interface InterceptNewTokenOptions {
  onAuthorized: (newToken: string) => void;
  onUnauthorized: () => void;
}
