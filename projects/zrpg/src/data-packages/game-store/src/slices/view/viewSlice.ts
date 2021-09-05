import { createSlice } from '@reduxjs/toolkit';

import { ScreenType, DialogType, HeaderType } from './view-enums';
import { clientActions } from '../client';
import { createNewGame } from '../common-actions';

export interface ViewState {
  screen: ScreenType;
  dialog: DialogType;
  header: HeaderType;
}

export const initialState: ViewState = {
  screen: ScreenType.mainScreen,
  dialog: DialogType.none,
  header: HeaderType.none,
};

export const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder.addCase(clientActions.onError, state => {
      state.screen = ScreenType.errorScreen;
      state.dialog = DialogType.none;
      state.header = HeaderType.none;
    });

    builder.addCase(createNewGame.pending, state => {
      state.screen = ScreenType.newGameScreen;
    });
  },
});

export const viewReducer = viewSlice.reducer;
export const viewActions = viewSlice.actions;
