import 'source-map-support/register';
import { useEffect } from 'react';
import { render } from 'react-blessed';
import { Provider } from 'react-redux';

import { store } from '@zrpg/game-store';
import { logger } from '@zrpg/log-http-client';

import { App } from './App';
import { screen } from './screen';

const Root = () => {
  useEffect(() => {
    logger.startGame();

    return () => {
      logger.log('Root unmount: exit')
      logger.exitGame();
    }
  }, []);

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

render(<Root />, screen);
