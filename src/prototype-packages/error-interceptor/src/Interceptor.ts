export class Interceptor<TInterceptors> {

  error: Error & {code?: string} = new Error('some error D:');

  constructor() {
    this.error.code = 'some';
  }

  intercept<K extends { [index: string]: (...args: any[]) => any }>(interceptors: K): ReturnType<K[keyof K]> {
    const interceptor = (interceptors as any)[this.error.code as 'code'] || interceptors._;

    return interceptor(this.error);
  }
}

export class Interceptor2<TInterceptors> {

  error?: Error & { code?: string };
  interceptors: Map<string, (...args: any[]) => any> = new Map();

  setError = (error: Error & { code?: string }) => {
    this.error = error;
  }

  intercept = (tag: string | ((error: Error) => TInterceptors), interceptor?: ((error: Error) => TInterceptors)): this => {
    const _tag = typeof tag === 'string' ? tag : '_';
    const _interceptor = interceptor ?? (() => void 0);

    this.interceptors.set(_tag, _interceptor);
    return this;
  }

  getValue = (): TInterceptors => {
    const interceptor = this.interceptors.get(this.error?.code as string) || this.interceptors.get('_');
    return interceptor?.(this.error);
  }
}
