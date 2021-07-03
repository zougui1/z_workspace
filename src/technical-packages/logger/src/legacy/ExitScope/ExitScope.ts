import { Exception } from '@zougui/error';

const noop = () => { };

export class ExitScope extends Exception {

  readonly scope: string;
  readonly error?: any;

  constructor(scope: string, error: any) {
    super(`Exit the scope '${scope}'`, 'EXIT_SCOPE', error);

    this.scope = scope;
    this.error = error;
  }

  static handle(scope: string, error: any): error is ExitScope {
    if (!(error instanceof ExitScope) || error.scope !== scope) {
      throw error;
    }

    return true;
  }

  static handleScope<T>(scope: string, callback: () => T): Promise<T> & Exitable {
    const promisedCallback = async () => await callback();
    let exit: ExitHandler = noop;

    const unhandledExitScopeError = new Error(`Exit for the scope "${scope}" is not handled.`);

    const promise = new Promise<T>((resolve, reject) => {
      promisedCallback()
        .then(resolve)
        .catch(error => {
          try {
            if (this.handle(scope, error)) {
              if (exit === noop) {
                throw unhandledExitScopeError;
              }

              exit(error);
            }
          } catch (error) {
            reject(error);
          }
        });
    }) as Promise<T> & Exitable;

    promise.exit = (callback: ExitHandler): Promise<T> => {
      exit = callback;
      return promise;
    }

    return promise;
  }
}

export type ExitHandler = (scope: ExitScope) => void;
type Exitable = { exit: (callback: ExitHandler) => void };
