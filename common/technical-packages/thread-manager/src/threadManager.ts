import { EventEmitter } from 'events';
import { logger } from '@zougui/logger';
import { threadList } from '@zougui/thread-list';

import {
  ExitOnErrorLog,
  DisgracefulExitLog,
  PreventedExitLog,
  ExitingLog,
  CleanupFailureLog,
  ExitLog,
} from './logs';
import { onShutdown, onCrash } from './utils';

const DEFAULT_SIGNAL = 'UNKNOWN';

class ThreadManager extends EventEmitter {

  private _requestCount: number = 0;
  private readonly _maxRequestCount: number = 10;

  constructor() {
    super();

    this.init();
  }

  //#region public
  async requestExit(code?: number, options: RequestExitOptions = {}): Promise<void | never> {
    const signal = options.signal ?? DEFAULT_SIGNAL;
    const exitInfo = { signal, code };

    this._requestCount++;

    if (options.error) {
      const error = options.error.stack || options.error;
      await logger.error(new ExitOnErrorLog({ ...exitInfo, error }));
    }

    if (this._requestCount >= this._maxRequestCount) {
      console.error('too many exit requests');
      process.exit(1);
    }

    if (threadList.runningThreads.length) {
      const threadsNames = threadList.runningThreads.map(thread => thread.name);
      const WarningLog = options.force ? DisgracefulExitLog : PreventedExitLog;

      await logger.warn(new WarningLog({ ...exitInfo, threads: threadsNames }));

      if (options.force) {
        await this.exit(exitInfo);
      }

      return;
    }

    await logger.info(new ExitingLog(exitInfo));
    await this.exit(exitInfo);
  }

  waitToExit(code?: number, options: RequestExitOptions = {}): Promise<never> {
    if (Number.isFinite(options.forceTimeout)) {
      setTimeout(() => {
        this.requestExit(code, { ...options, force: true });
      }, options.forceTimeout);
    }

    return new Promise((resolve, reject) => {
      threadList.onceFinished(async () => {
        const signal = options.signal ?? DEFAULT_SIGNAL;

        this.requestExit(code, {
          ...options,
          signal,
        }).catch(reject);
      });
    });
  }
  //#endregion

  //#region private
  private exit(data: { code?: number; signal: NodeJS.Signals | string }): Promise<never> {
    return new Promise(() => {
      this.emit('exit', data);
    });
  }

  private init() {
    process.stdin.resume();

    onShutdown((signal) => {
      this.requestExit(0, { signal });
    });

    onCrash((signal, error) => {
      this.requestExit(1, { signal, force: true, error });
    });

    this.on('exit', async ({ code, signal }: { code?: number, signal: NodeJS.Signals | string }) => {
      await Promise.all(threadList.cleanups.map(async cleanup => {
        try {
          await cleanup(signal);
        } catch (error) {
          await logger.error(new CleanupFailureLog({ code, signal, error }));
        }
      }));

      await logger.info(new ExitLog({ signal, code }));

      // wait for the message(s) to be printed
      threadList.onceFinished(this.forceExit);
      // force the exit if the messages take too long to be printed
      setTimeout(this.forceExit, 500);
    });
  }

  private forceExit(code?: number): never {
    process.stdin.pause();
    process.exit(code);
  }
  //#endregion
}

export const threadManager = new ThreadManager();

export interface RequestExitOptions {
  signal?: NodeJS.Signals | string;
  force?: boolean;
  forceTimeout?: number;
  error?: any;
}
