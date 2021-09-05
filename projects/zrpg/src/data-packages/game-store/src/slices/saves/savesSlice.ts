import { createSlice } from '@reduxjs/toolkit';

import * as middlewares from './middlewares';
import { sliceName } from './sliceName';

export interface SavesState {
  names: string[];
}

export const initialState: SavesState = {
  names: [],
};

export const savesSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {

  },

  extraReducers: builder => {
    builder.addCase(middlewares.findSaveNames.fulfilled, (state, action) => {
      state.names = action.payload;
    });
  },
});

export const savesReducer = savesSlice.reducer;
export const savesActions = savesSlice.actions;
