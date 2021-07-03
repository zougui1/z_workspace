import { EventEmitter } from 'events';
import * as uuid from 'uuid';

import { IThread } from './IThread';
import { Cleanup } from './Cleanup';

class ThreadList extends EventEmitter {

  private _threads: Record<string, IThread> = {};
  private _cleanups: Cleanup[] = [];

  addThread(name: string): string {
    const processId = uuid.v4();
    this._threads[processId] = { name, id: processId };
    return processId;
  }

  removeThread(id: string): void {
    delete this._threads[id];

    if (!this.runningThreads.length) {
      this.emit('finish');
    }
  }

  addCleanup(cleanup: Cleanup): void {
    const wrappedBeforeExitListener = async (signal: NodeJS.Signals | string): Promise<void> => {
      await cleanup(signal);
    }
    this._cleanups.push(wrappedBeforeExitListener);
  }

  get cleanups(): Cleanup[] {
    return [...this._cleanups];
  }

  get runningThreads(): IThread[] {
    return Object.values(this._threads);
  }

  onceFinished(callback: () => void): void {
    if (!this.runningThreads.length) {
      return callback();
    }

    this.once('finish', callback);
  }
}

export const threadList = new ThreadList();
