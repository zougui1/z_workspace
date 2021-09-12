import { Typography } from '@material-ui/core';

import { LogNodeContext } from '@zougui/log-types';

export const LogNodeEnv = ({ context }: LogNodeEnvProps) => {
  return (
    <div>
      <Typography variant="h5">Environment</Typography>

      <Typography>
        Environment: NodeJS {context.process.nodeVersion}
        <br />
        Mode: {context.app.env}
        <br />
        OS: {context.process.os.platform} {context.process.os.version}
        <br />
        PID: {context.process.processId}
        <br />
        User: {context.process.user}
      </Typography>
    </div>
  );
}

export interface LogNodeEnvProps {
  context: LogNodeContext;
}
