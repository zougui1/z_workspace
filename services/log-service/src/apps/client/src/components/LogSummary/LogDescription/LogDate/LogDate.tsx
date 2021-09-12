import moment from 'moment';
import clsx from 'clsx';
import { Tooltip, Typography, Hidden } from '@material-ui/core';

import { logFormat } from '@zougui/log-types';

import { useStyles } from './LogDate.styles';

export const LogDate = ({ date, className }: LogDateProps) => {
  const classes = useStyles();

  const dateMoment = moment(date, logFormat);

  return (
    <>
      <Tooltip
        title={
          <Typography>
            {dateMoment.format('LLLL')}
          </Typography>
        }
      >
        <span className={clsx(classes.date, className)}>
          <Hidden smDown>
            {date}
          </Hidden>

          <Hidden mdUp>
            {dateMoment.format('L LT')}
          </Hidden>
        </span>
      </Tooltip>
    </>
  );
}

export interface LogDateProps {
  date: string | Date | moment.Moment;
  className?: string;
}
