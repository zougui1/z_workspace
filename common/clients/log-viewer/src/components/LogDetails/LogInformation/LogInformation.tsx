import moment from 'moment';
import { Typography } from '@material-ui/core';

import { ILog, logFormat } from '@zougui/log-types';

export const LogInformation = ({ log }: LogInformationProps) => {
  return (
    <div>
      <Typography variant="h5">Information</Typography>

      <Typography>
        Code: {log.code}
      </Typography>

      <Typography>
        Logged on: {moment(log.createdAt, logFormat).format('LLLL')}
        <br />
        In {log.context.app.file}:{log.context.app.line}
        <br />
        By {log.context.app.functionName}
      </Typography>
    </div>
  );
}

export interface LogInformationProps {
  log: ILog;
}
