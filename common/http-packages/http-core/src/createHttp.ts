import axios, { AxiosRequestConfig } from 'axios';

import { addInterceptorsMethods, overrideRequestMethods } from './overrides';
import { RequestInterceptor, ResponseInterceptor, HttpInstance } from './types';

export const createHttp = (options?: CreateHttpOptions): HttpInstance => {
  const http = axios.create(options) as HttpInstance;

  addInterceptorsMethods(http);
  overrideRequestMethods(http);

  http.addRequestInterceptors(...(options?.interceptors?.request ?? []));
  http.addResponseInterceptors(...(options?.interceptors?.response ?? []));

  return http;
}

export interface CreateHttpOptions extends AxiosRequestConfig {
  interceptors?: {
    request?: RequestInterceptor[];
    response?: ResponseInterceptor[];
  };
}
