import os from 'os';

import isBrowser from 'is-browser';
import StackTracey from 'stacktracey';

import { EnvironmentTypes, LogContext, ILogContextApp, LogNodeContext, LogBrowserContext } from '@zougui/log-types';
import env from '@zougui/env';

export const getContextData = (frame: StackTracey.Entry): LogContext => {
  if (isBrowser) {
    return getBrowserContext(frame);
  }

  return getNodeContext(frame);
}

const getAppContext = (frame: StackTracey.Entry): ILogContextApp => {
  return {
    env: env.NODE_ENV,
    name: env.APP_NAME,
    version: env.APP_VERSION,
    file: frame.file,
    line: frame.line,
    functionName: frame.callee,
  };
}

const getNodeContext = (frame: StackTracey.Entry): LogNodeContext => {
  return {
    env: EnvironmentTypes.node,
    app: getAppContext(frame),
    process: {
      os: {
        platform: process.platform,
        version: os.release(),
      },
      nodeVersion: process.version,
      user: os.userInfo().username,
      processId: process.pid,
    },
  };
}

const getBrowserContext = (frame: StackTracey.Entry): LogBrowserContext => {
  return {
    env: EnvironmentTypes.browser,
    app: getAppContext(frame),
    process: {
      os: {
        platform: process.platform,
      },
      host: window.location.host,
      userAgent: window.navigator.userAgent,
      language: window.navigator.language,
      languages: window.navigator.languages,
    },
  };
}
