import { createAsyncThunk } from '@reduxjs/toolkit';

import { findClasses, Class } from '@zrpg/game-classes';

export const startNewGame = createAsyncThunk(
  'common/startNewGame',
  async (): Promise<{ classes: Class[] }> => {
    return {
      classes: await findClasses()
    };
  },
);
