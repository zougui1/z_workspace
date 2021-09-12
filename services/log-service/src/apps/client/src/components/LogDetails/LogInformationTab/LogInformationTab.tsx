import { Typography, Grid } from '@material-ui/core';

import { ILog } from '@zougui/log-types';
import { isObjectEmpty } from '@zougui/utils';

import { useStyles } from './LogInformationTab.styles';
import { LogInformation } from '../LogInformation';
import { LogEnv } from '../LogEnv';
import { LogTopics } from '../../LogTopics';
import { Json } from '../../Json';

export const LogInformationTab = ({ log }: LogInformationTabProps) => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={12} className={classes.section}>
        <LogTopics topics={log.topics} />
      </Grid>

      <Grid container justifyContent="space-between">
        <Grid item xs={12} lg="auto" className={classes.section}>
          <LogInformation log={log} />
        </Grid>

        <Grid item xs="auto" lg="auto" className={classes.section}>
          <LogEnv context={log.context} />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        {isObjectEmpty(log.data) ? (
          <Typography style={{ textAlign: 'center' }} variant="h5">No data</Typography>
        ) : (
            <>
              <Typography style={{ textAlign: 'center' }} variant="h5">Data</Typography>

              <Json style={{ maxHeight: 395 }} data={log.data} />
            </>
        )}
      </Grid>
    </Grid>
  );
}

export interface LogInformationTabProps {
  log: ILog;
}
