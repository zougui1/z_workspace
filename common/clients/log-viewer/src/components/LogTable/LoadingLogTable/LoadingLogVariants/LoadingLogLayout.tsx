import { Grid, GridProps, Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

export const LoadingLogLayout = (props: LoadingLogLayoutProps) => {
  const { left, date, level, app, message, right, location } = props;

  return (
    <Box p={1}>
      <Grid container justifyContent="space-between">
        <Grid container item xs={left} spacing={1}>
          <Grid item xs={date}>
            <Skeleton variant="text" width="100%" />
          </Grid>
          <Grid item xs={level}>
            <Skeleton variant="text" width="100%" />
          </Grid>
          <Grid item xs={app}>
            <Skeleton variant="text" width="100%" />
          </Grid>
          <Grid item xs={message}>
            <Skeleton variant="text" width="100%" />
          </Grid>
        </Grid>

        <Grid container item xs={right} justifyContent="flex-end">
          <Grid item xs={location}>
            <Skeleton variant="text" width="100%" />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export interface LoadingLogLayoutProps {
  left: GridProps['xs'];
  date: GridProps['xs'];
  level: GridProps['xs'];
  app: GridProps['xs'];
  message: GridProps['xs'];
  right: GridProps['xs'];
  location: GridProps['xs'];
}
