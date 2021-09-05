import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Class } from '@zrpg/game-classes';

import { createNewGame } from '../common-actions';

export interface ClientState {
  error: any;
  classes: Class[];
}

export const initialState: ClientState = {
  error: null,
  classes: [],
};

export const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    onError: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
  },

  extraReducers: builder => {
    builder.addCase(createNewGame.fulfilled, (state, action) => {
      state.classes = action.payload.classes;
    });
  },
});

export const clientReducer = clientSlice.reducer;
export const clientActions = clientSlice.actions;
export type { Class };
