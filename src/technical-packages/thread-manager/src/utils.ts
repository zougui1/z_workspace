import { SHUTDOWN_SIGNALS, CRASH_SIGNALS, EXIT_SIGNALS } from './constants';

export const onShutdown = (callback: (signal: NodeJS.Signals, ...args: any[]) => any): void => {
  for (const signal of SHUTDOWN_SIGNALS) {
    process.on(signal, (...args) => callback(signal, ...args));
  }
}

export const onCrash = (callback: (signal: string, ...args: any[]) => any): void => {
  for (const signal of CRASH_SIGNALS) {
    process.on(signal, (...args) => callback(signal, ...args));
  }
}

export const onExit = (callback: (signal: string, ...args: any[]) => any): void => {
  for (const signal of EXIT_SIGNALS) {
    process.on(signal, (...args) => callback(signal, ...args));
  }
}
