import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface Interceptor<T> {
  onResolved?: (value: T) => T | Promise<T>;
  onRejected?: (error: any) => any;
}

export type RequestInterceptor = Interceptor<HttpRequestConfig>;
export type ResponseInterceptor = Interceptor<AxiosResponse<any>>;

export interface HttpRequestConfig extends AxiosRequestConfig {
  params?: Record<string, string>;
  query?: Record<string, any>;
}

export interface HttpInstance extends AxiosInstance {
  get: <T = any, R = AxiosResponse<T>>(url: string, config?: HttpRequestConfig) => Promise<R>;
  delete: <T = any, R = AxiosResponse<T>>(url: string, config?: HttpRequestConfig) => Promise<R>;
  head: <T = any, R = AxiosResponse<T>>(url: string, config?: HttpRequestConfig) => Promise<R>;
  options: <T = any, R = AxiosResponse<T>>(url: string, config?: HttpRequestConfig) => Promise<R>;
  post: <T = any, R = AxiosResponse<T>>(url: string, data: any, config?: HttpRequestConfig) => Promise<R>;
  put: <T = any, R = AxiosResponse<T>>(url: string, data: any, config?: HttpRequestConfig) => Promise<R>;
  patch: <T = any, R = AxiosResponse<T>>(url: string, data: any, config?: HttpRequestConfig) => Promise<R>;
  addRequestInterceptors: (...interceptors: RequestInterceptor[]) => void;
  addResponseInterceptors: (...interceptors: ResponseInterceptor[]) => void;
}
