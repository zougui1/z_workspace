import { EventEmitter } from 'events';
import { wait } from '@zougui/utils';

import { Thread } from './Thread';

export class Queue extends EventEmitter {

  protected id: number = 0;
  protected threads: Thread[] = [];
  protected options: QueueOptions;
  protected lastCallTime: number = 0;
  protected processing: boolean = false;

  constructor(options: QueueOptions = {}) {
    super();

    this.options = options;
    this.init();
  }

  async wait<T>(exec: () => T): Promise<T> {
    const thread = this.add(exec);
    return await thread.wait();
  }

  //#region protected
  protected add<T>(exec: () => T): Thread<T> {
    const thread = new Thread(this.id++, exec);
    this.threads.push(thread);
    this.emit('exec');
    return thread;
  }
  //#endregion

  //#region private
  private init(): void {
    this.on('exec', async () => {
      if (!this.processing) {
        await this.execAll();
      }
    });
  }

  private async execAll(): Promise<void> {
    this.processing = true;

    for (const thread of this.threads) {
      await this.exec(thread);
    }

    this.processing = false;
  }

  private async exec(thread: Thread): Promise<void> {
    const now = Date.now();
    const throttledNow = this.lastCallTime + (this.options.throttle ?? 0);
    const timeout = throttledNow - now;

    await wait(Math.max(0, timeout));
    await this.doExec(thread);
  }

  private async doExec(thread: Thread): Promise<void> {
    this.lastCallTime = Date.now();
    await thread.execute();
  }
  //#endregion
}

export interface QueueOptions {
  throttle?: number;
}
