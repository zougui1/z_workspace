import { useEffect } from 'react';

import { ScreenType, useGameSelector } from '@zrpg/game-store';
import { logger } from '@zrpg/log-http-client';

import { ErrorScreen } from './screens/ErrorScreen';
import { MainScreen } from './screens/MainScreen';
import { StartNewGameScreen } from './screens/StartNewGameScreen';
import { ScreenNotFound } from './screens/ScreenNotFound';

const screensMap: Record<ScreenType, () => JSX.Element> = {
  [ScreenType.errorScreen]: ErrorScreen,
  [ScreenType.mainScreen]: MainScreen,
  [ScreenType.newGameScreen]: StartNewGameScreen,
}

export const Router = () => {
  const screen = useGameSelector(state => state.view.screen);
  const CurrentScreen = screensMap[screen];

  useEffect(() => {
    logger.log(`Change screen: ${screen}`);
  }, [screen]);

  return CurrentScreen ? <CurrentScreen /> : <ScreenNotFound />;
}
