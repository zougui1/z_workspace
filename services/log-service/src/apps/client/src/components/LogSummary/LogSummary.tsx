import { Typography, Hidden } from '@material-ui/core';

import { ILog } from '@zougui/log-types';

import { useStyles } from './LogSummary.styles';
import { LogDescription } from './LogDescription';
import { LogLocation } from './LogLocation';

export const LogSummary = ({ log }: LogSummaryProps) => {
  const classes = useStyles();

  return (
    <Typography component="div" className={classes.root} variant="subtitle1">
      <LogDescription log={log} />

      <Hidden smDown>
        <LogLocation log={log} />
      </Hidden>
    </Typography>
  );
}

export interface LogSummaryProps {
  log: ILog;
}
