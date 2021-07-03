import { Log } from '@zougui/logger';

export interface ExitOnErrorLogData {
  signal: string;
  code?: number;
  error: any;
}

export const ExitOnErrorLog = new Log<ExitOnErrorLogData>()
  .setCode('process.uncaughtError')
  .setTopics(['process'])
  .setMessage(({ data }) => `An error occured:\n${data.error?.message ?? data.error ?? 'Unknown Error'}`)
  .toClass();

export interface TooManyExitRequestsLogData {
  signal: string;
  code?: number;
  requestCount: number;
}

export const TooManyExitRequestsLog = new Log<TooManyExitRequestsLogData>()
  .setCode('process.exit.request.tooMany')
  .setTopics(['process', 'exit'])
  .setMessage('too many exit requested, forcing exit.')
  .toClass();

export interface DisgracefulExitLogData {
  signal: string;
  code?: number;
  threads: string[];
}

export const DisgracefulExitLog = new Log<DisgracefulExitLogData>()
  .setCode('process.exit.forced')
  .setTopics(['process', 'exit', 'force'])
  .setMessage(({ data }) => `Forced to exit while ${data.threads.length} threads were still running.`)
  .toClass();

export interface PreventedExitLogData {
  signal: string;
  code?: number;
  threads: string[];
}

export const PreventedExitLog = new Log<PreventedExitLogData>()
  .setCode('process.exit.prevented')
  .setTopics(['process', 'exit', 'prevented'])
  .setMessage(({ data }) => `Couldn't exit the process, ${data.threads.length} threads were still running.`)
  .toClass();

export const ExitingLog = new Log()
  .setCode('process.exit.start')
  .setTopics(['process', 'exit'])
  .setMessage('Process exiting...')
  .toClass();

export const ExitLog = new Log()
  .setCode('process.exit.success')
  .setTopics(['process', 'exit'])
  .setMessage('Process exited.')
  .toClass();

export interface CleanupFailureLogData {
  signal: string;
  code?: number;
  error: any;
}

export const CleanupFailureLog = new Log<CleanupFailureLogData>()
  .setCode('process.exit.cleanup.error')
  .setTopics(['process', 'exit', 'cleanup'])
  .setMessage(({ data}) => `A thread failed to clean-up: ${data.error?.message || data.error || 'No error message provided.'}`)
  .toClass();
