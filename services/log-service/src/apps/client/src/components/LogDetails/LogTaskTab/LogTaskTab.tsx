//import moment from 'moment';
import { useQuery } from 'react-query';
import { Typography, Tooltip } from '@material-ui/core';

import { ILog, ILogTask } from '@zougui/log-types';
import logHttpClient from '@zougui/log-http-client';

import { Log } from '../../Log';
//import { LogTopics } from '../../LogTopics';

export const LogTaskTab = ({ task }: LogTaskTabProps) => {
  const query = useQuery('log-tasks', () => {
    return logHttpClient.getLogs({
      query: {
        task: { id: task.id }
      },
    });
  });

  const tasks: ILog[] = query.data?.data ?? [];
  const finishTransaction = tasks.find(log => log.task?.timing);
  const timing = finishTransaction?.task?.timing;

  return (
    <div>
      <Typography variant="h5">Task {task.id}</Typography>

      {timing && (
        <Tooltip
          title={
            <Typography>
              {timing.milliseconds} milliseconds
            </Typography>
          }
        >
          <Typography component="span">
            Done in {timing.formatted}
          </Typography>
        </Tooltip>
      )}

      <div>
        <Typography variant="h5">Associated logs:</Typography>

        <div>
          {tasks.map(log => (
            <Log key={log.logId} log={log} />
          ))}
        </div>
      </div>
    </div>
  );
}

export interface LogTaskTabProps {
  task: ILogTask;
}
