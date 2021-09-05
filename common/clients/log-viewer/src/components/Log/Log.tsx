import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';

import { ILog } from '@zougui/log-types';

import { useStyles } from './Log.styles';
import { LogSummary } from '../LogSummary';
import { LogDetails } from '../LogDetails';

export const Log = ({ log }: LogProps) => {
  const classes = useStyles();

  return (
    <Accordion className={classes.root} classes={{ expanded: classes.expanded }} TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary>
        <LogSummary log={log} />
      </AccordionSummary>

      <AccordionDetails >
        <LogDetails log={log} />
      </AccordionDetails>
    </Accordion>
  )
}

export interface LogProps {
  log: ILog;
}
