import { EventEmitter } from 'events';

export class Thread<T = any> extends EventEmitter {

  readonly id: number;
  readonly func: () => T | Promise<T>;

  constructor(id: number, func: () => T | Promise<T>) {
    super();

    this.id = id;
    this.func = func;
  }

  wait(): Promise<T> {
    return new Promise((resolve, reject) => {
      this.once('resolve', resolve);
      this.once('reject', reject);
    });
  }

  async execute(): Promise<void> {
    try {
      const value = await this.func();
      this.emit('resolve', value);
    } catch (error) {
      this.emit('reject', error);
    }
  }
}
