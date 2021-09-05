import { AsyncLocalStorage } from 'async_hooks';

export class Context<T extends Record<string, any>> {

  protected _storage: AsyncLocalStorage<T> = new AsyncLocalStorage();

  run<TReturn>(data: T, callback: () => TReturn): TReturn {
    return this._storage.run(data, callback);
  }

  get<K extends keyof T>(key: K): T[K] {
    return this.getStore()[key];
  }

  set<K extends keyof T>(key: K, value: T[K]): this {
    const store = this.getStore();
    store[key] = value;

    return this;
  }

  getStore(): T {
    const store = this.tryGetStore();

    if (!store) {
      throw new Error('The context must be initialized in order to be used.');
    }

    return store;
  }

  tryGetStore(): T | undefined {
    return this._storage.getStore();
  }
}
