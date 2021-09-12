import { Paper } from '@material-ui/core';

import { random, randomItem } from '@zougui/utils';

import { LoadingLogVariants } from './LoadingLogVariants';

export const LoadingLogTable = () => {
  const count = random(15, 25);
  const loadingLogs = new Array(count).fill(0).map(() => randomItem(LoadingLogVariants));

  return (
    <Paper>
      {loadingLogs.map((LoadingLogVariant, i) => (
        <LoadingLogVariant key={i} />
      ))}
    </Paper>
  );
}
