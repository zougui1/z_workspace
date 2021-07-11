import { LogBuilder } from '@zougui/logger';
import env from '@zougui/env';

const scope = env.getScope(__filename);

export interface ExitOnErrorLogData {
  signal: string;
  code?: number;
  error: any;
}

export const ExitOnErrorLog = new LogBuilder<ExitOnErrorLogData>()
  .setCode('process.uncaughtError')
  .setScope(scope)
  .setTopics(['process'])
  .setMessage(({ data }) => `An error occured:\n${data.error?.message ?? data.error ?? 'Unknown Error'}`)
  .toClass();

export interface TooManyExitRequestsLogData {
  signal: string;
  code?: number;
  requestCount: number;
}

export const TooManyExitRequestsLog = new LogBuilder<TooManyExitRequestsLogData>()
  .setCode('process.exit.request.tooMany')
  .setScope(scope)
  .setTopics(['process', 'exit'])
  .setMessage('too many exit requested, forcing exit.')
  .toClass();

export interface DisgracefulExitLogData {
  signal: string;
  code?: number;
  threads: string[];
}

export const DisgracefulExitLog = new LogBuilder<DisgracefulExitLogData>()
  .setCode('process.exit.forced')
  .setScope(scope)
  .setTopics(['process', 'exit', 'force'])
  .setMessage(({ data }) => `Forced to exit while ${data.threads.length} threads were still running.`)
  .toClass();

export interface PreventedExitLogData {
  signal: string;
  code?: number;
  threads: string[];
}

export const PreventedExitLog = new LogBuilder<PreventedExitLogData>()
  .setCode('process.exit.prevented')
  .setScope(scope)
  .setTopics(['process', 'exit', 'prevented'])
  .setMessage(({ data }) => `Couldn't exit the process, ${data.threads.length} threads were still running.`)
  .toClass();

export const ExitingLog = new LogBuilder()
  .setCode('process.exit.start')
  .setScope(scope)
  .setTopics(['process', 'exit'])
  .setMessage('Process exiting...')
  .toClass();

export const ExitLog = new LogBuilder()
  .setCode('process.exit.success')
  .setScope(scope)
  .setTopics(['process', 'exit'])
  .setMessage('Process exited.')
  .toClass();

export interface CleanupFailureLogData {
  signal: string;
  code?: number;
  error: any;
}

export const CleanupFailureLog = new LogBuilder<CleanupFailureLogData>()
  .setCode('process.exit.cleanup.error')
  .setScope(scope)
  .setTopics(['process', 'exit', 'cleanup'])
  .setMessage(({ data}) => `A thread failed to clean-up: ${data.error?.message || data.error || 'No error message provided.'}`)
  .toClass();
