import { RequestInterceptor, ResponseInterceptor, HttpInstance } from '../types';

export const addInterceptorsMethods = (http: HttpInstance): HttpInstance => {
  http.addRequestInterceptors = (...interceptors: RequestInterceptor[]) => {
    for (const { onResolved, onRejected } of interceptors) {
      http.interceptors.request.use(onResolved, onRejected);
    }
  }

  http.addResponseInterceptors = (...interceptors: ResponseInterceptor[]) => {
    for (const { onResolved, onRejected } of interceptors) {
      http.interceptors.response.use(onResolved, onRejected);
    }
  }

  return http;
}
