import { createAsyncThunk } from '@reduxjs/toolkit';

import { findClasses, Class } from '@zrpg/game-classes';

export const createNewGame = createAsyncThunk(
  'common/createNewGame',
  async (): Promise<{ classes: Class[] }> => {
    return {
      classes: await findClasses()
    };
  },
);
