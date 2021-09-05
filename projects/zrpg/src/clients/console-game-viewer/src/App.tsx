import { useEffect } from 'react';

import { useGameSelector, useGameDispatch, clientActions } from '@zrpg/game-store';
import { onError, enableGracefulExit } from './process';
import { Router } from './Router';
import { ErrorScreen } from './screens/ErrorScreen';

export const App = () => {
  const error = useGameSelector(state => state.client.error);
  const dispatch = useGameDispatch();

  useEffect(() => {
    onError(error => {
      if (error instanceof Error) {
        dispatch(clientActions.onError({
          message: error.message,
          stack: error.stack,
        }));
      } else {
        dispatch(clientActions.onError(error));
      }
    });
    enableGracefulExit();
  }, []);

  return (
    <box>
      {error ? <ErrorScreen /> : <Router />}
    </box>
  );
}
