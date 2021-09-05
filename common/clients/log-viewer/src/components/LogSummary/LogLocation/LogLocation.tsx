import path from 'path';

import { Tooltip, Typography } from '@material-ui/core';

import { ILog } from '@zougui/log-types';

export const LogLocation = ({ log }: LogLocationProps) => {
  const fileName = path.basename(log.context.app.file);

  return (
    <div>
      <Tooltip
        title={
          <Typography>
            {log.context.app.file}
          </Typography>
        }
      >
        <span>
          {fileName}:{log.context.app.line}
        </span>
      </Tooltip>
    </div>
  );
}

export interface LogLocationProps {
  log: ILog;
}
