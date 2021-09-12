import { configureStore } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

import { logger } from '@zrpg/log-http-client';

import { userReducer, savesReducer, clientReducer, viewReducer, fightReducer } from './slices';

export const store = configureStore({
  reducer: {
    log: (state = {}, action: any) => {
      setTimeout(() => {
        if (!process.env.DEBUG_STORE) {
          return;
        }

        const state = { ...store.getState() };
        delete state.log;
        const stateStr = JSON.stringify(state, null, 2);
        const actionStr = JSON.stringify(action, null, 2);

        logger.log(`Action: ${actionStr}\nState: ${stateStr}`);
      }, 50);

      return state;
    },
    user: userReducer,
    saves: savesReducer,
    client: clientReducer,
    view: viewReducer,
    fight: fightReducer,
  },
});

export type GameState = ReturnType<typeof store.getState>;
export const useGameSelector = <T>(selector: (state: GameState) => T): T => useSelector(selector);

export type GameDispatch = typeof store.dispatch;
export const useGameDispatch = () => useDispatch<GameDispatch>();
