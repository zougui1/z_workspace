import clsx from 'clsx';
import { Tooltip, Typography, Grid, Hidden } from '@material-ui/core';

import { ILog, LogColor, EnvironmentTypes } from '@zougui/log-types';

import { LogDate } from './LogDate';
import { useStyles } from './LogDescription.styles';
import { LogLocation } from '../LogLocation';

export const LogDescription = ({ log }: LogDescriptionProps) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} md="auto" className={classes.section}>
        <Grid container justifyContent="space-between">
          <Grid item xs={12} sm="auto">
            <Grid container>
              <Grid item xs={12} sm="auto" className={classes.section}>
                <LogDate className={classes.part} date={log.createdAt} />
              </Grid>

              <Grid item className={classes.section}>
                <span className={classes.part} style={{ color: LogColor[log.level] }}>
                  {log.level}
                </span>


                <Tooltip
                  title={
                    <Typography>
                      App version: {log.context.app.version}
                      {log.context.env === EnvironmentTypes.node && (
                        <>
                          <br />
                          Node version: {log.context.process.nodeVersion}
                        </>
                      )}
                    </Typography>
                  }
                >
                  <span className={clsx(classes.appName, classes.part)}>
                    {log.context.app.name}
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>

          <Hidden xsDown mdUp>
            <Grid item>
              <LogLocation log={log} />
            </Grid>
          </Hidden>
        </Grid>
      </Grid>

      <Grid item className={classes.section}>
        <span className={classes.part}>
          {log.message}
        </span>
      </Grid>
    </Grid>
  );
}

export interface LogDescriptionProps {
  log: ILog;
}
