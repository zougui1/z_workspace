import { Typography } from '@material-ui/core';

import { LogBrowserContext } from '@zougui/log-types';

export const LogBrowserEnv = ({ context }: LogBrowserEnvProps) => {
  const acceptedLanguages = context.process.languages.filter(lang => lang !== context.process.language);

  return (
    <div>
      <Typography variant="h5">Environment</Typography>

      <Typography>
        Environment: Browser ({context.process.userAgent})
        <br />
        Mode: {context.app.env}
        <br />
        OS: {context.process.os.platform}
        <br />
        Host: {context.process.host}
        <br />
        Language: {context.process.language} {acceptedLanguages.length && (
          <>(also accepted: {acceptedLanguages.join(', ')})</>
        )}
      </Typography>
    </div>
  );
}

export interface LogBrowserEnvProps {
  context: LogBrowserContext;
}
