import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  characters: any[];
  zone: any;
  coords: any;
  name: string;
  battle: any;
  bag: any;
  gold: number;
  location: any;
  building: any;
}

export const initialState: UserState = {
  characters: [],
  zone: null,
  coords: null,
  name: '',
  battle: null,
  bag: null,
  gold: 0,
  location: null,
  building: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    init: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

export const userReducer = userSlice.reducer;
export const userActions = userSlice.actions;
