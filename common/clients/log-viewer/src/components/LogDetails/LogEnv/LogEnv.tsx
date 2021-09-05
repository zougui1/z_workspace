import { EnvironmentTypes, LogContext, LogNodeContext, LogBrowserContext } from '@zougui/log-types';

import { LogNodeEnv } from './LogNodeEnv';
import { LogBrowserEnv } from './LogBrowserEnv';
import { LogEnvNotFound } from './LogEnvNotFound';

const LogEnvRenderers = {
  [EnvironmentTypes.node]: ({ context }: LogEnvProps) => <LogNodeEnv context={context as LogNodeContext} />,
  [EnvironmentTypes.browser]: ({ context }: LogEnvProps) => <LogBrowserEnv context={context as LogBrowserContext} />,
  [EnvironmentTypes.electron]: () => null,
  [EnvironmentTypes.mobile]: () => null,
};

export const LogEnv = ({ context }: LogEnvProps) => {
  const LogEnvRenderer = LogEnvRenderers[context.env] ?? LogEnvNotFound;

  return <LogEnvRenderer context={context} />;
}

export interface LogEnvProps {
  context: LogContext;
}
