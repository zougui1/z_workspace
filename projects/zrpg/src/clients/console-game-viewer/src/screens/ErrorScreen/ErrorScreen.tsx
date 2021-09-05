import { useEffect } from 'react';

import { useGameSelector } from '@zrpg/game-store';
import { logger } from '@zrpg/log-http-client';

import { classes } from './ErrorScreen.styles';
import { CenterBox } from '../../components/layouts/CenterBox';

export const ErrorScreen = () => {
  const error = useGameSelector(state => state.client.error);

  const errorMessage = error.stack || error.message || (
    typeof error === 'string' ? error : JSON.stringify(error, null, 2)
  );

  useEffect(() => {
    logger.log(errorMessage);
  }, []);

  return (
    <CenterBox class={classes.root}>
      <text>An unrecoverable error has occured:</text>
      <text class={classes.error}>{errorMessage}</text>

      {process.env.NODE_ENV === 'development' && (
        <text class={classes.todo}>TODO: Be able to restart the game from here</text>
      )}
    </CenterBox>
  );
}
