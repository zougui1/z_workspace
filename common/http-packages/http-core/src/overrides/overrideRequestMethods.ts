import qs from 'qs';
import templateUrl from 'template-url';
import { AxiosResponse } from 'axios';

import { HttpInstance, HttpRequestConfig } from '../types';

enum PostlessMethods {
  get = 'get',
  delete = 'delete',
  head = 'head',
  options = 'options',
}

enum PostfulMethods {
  post = 'post',
  put = 'put',
  patch = 'patch',
}

export const overrideRequestMethods = (http: HttpInstance): HttpInstance => {
  for (const [, method] of Object.entries(PostlessMethods)) {
    overridePostlessRequestUrlConfig(http, method);
  }

  for (const [, method] of Object.entries(PostfulMethods)) {
    overridePostfulRequestUrlConfig(http, method);
  }

  return http;
}

/**
 * @mutate this function mutates `config`
 */
const configureUrl = (url: string, config?: HttpRequestConfig): string => {
  if (config?.params) {
    url = templateUrl(url, config.params);
    // avoid side effects due to axios's default behavior
    delete config.params;
  }

  if (config?.query) {
    url += `?${qs.stringify(config.query, { encodeValuesOnly: true })}`;
    // avoid side effects due to axios's default behavior
    delete config.query;
  }

  return url;
}

const overridePostlessRequestUrlConfig = (http: HttpInstance, method: PostlessMethods) => {
  const defaultMethod = http[method];

  http[method] = async <T = any, R = AxiosResponse<T>>(url: string, config?: HttpRequestConfig): Promise<R> => {
    url = configureUrl(url, config);
    return await defaultMethod(url, config);
  }
}

const overridePostfulRequestUrlConfig = (http: HttpInstance, method: PostfulMethods) => {
  const defaultMethod = http[method];

  http[method] = async <T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: HttpRequestConfig): Promise<R> => {
    url = configureUrl(url, config);
    return await defaultMethod(url, data, config);
  }
}
