// @ts-nocheck
import { Interceptor2 } from './Interceptor';

const asyncFunc = <TData, TError>(): Promise<TData | TError> & Interceptor2<TError> => {
  let res: any;
  let rej: any;

  // @ts-ignore
  const promise: Promise<TData> & Interceptor2<TError> = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
    const err: Error & { code?: string } = new Error('some error');
    err.code = 'some unknown';
    process.nextTick(() => reject(err));
  });

  // @ts-ignore
  const returnPromise: Promise<TData> & Interceptor2<TError> = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });

  const interceptor = new Interceptor2<TError>();

  (returnPromise as any).intercept = (...args: any[]) => {
    // @ts-ignore
    interceptor.intercept(...args);
    return returnPromise;
  }

  promise.catch(error => {
    interceptor.setError(error);

    const intercepted = interceptor.getValue();

    if (!intercepted) {
      console.log('reject')
      rej(error);
    }

    console.log('resolve')
    res(intercepted);
  });

  return returnPromise;
}

(async () => {
  const httpResponse = await asyncFunc<HttpResponse>()
    .intercept('error.validation', error => new HttpResponseBadRequest(error.message))
    .intercept('error.notFound', () => new HttpResponseNotFound('something not found'))
    .intercept('error.unknown', () => new HttpResponseInternalServerError('unknown error'))
    .then(data => new HttpResponseOK(data));

  return httpResponse;
})();
