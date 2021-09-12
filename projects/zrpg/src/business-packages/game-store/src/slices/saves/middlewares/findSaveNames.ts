import { createAsyncThunk } from '@reduxjs/toolkit';

import { getSaveNames } from '@zrpg/game-fs';

export const findSaveNames = createAsyncThunk(
  'saves/findSaveNames',
  async (): Promise<string[]> => {
    return await getSaveNames();
  },
);
