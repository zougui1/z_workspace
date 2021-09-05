import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { selectOption, clickOption, pickOption, logPicked, getSelectedOption, changeSelect } from './helpers';

export interface Option {
  /**
   * unique timestamp
   */
  createdAt: number;
  value: any;
  text: string | number;
  index: number;
  onSelect?: (value: any) => void;
  onClick?: (value: any) => void;
  onPick?: (value: any) => void;
}

export interface SelectState {
  onChange?: (value: any) => void;
  label?: string;
  options: Option[];
  selectedOption: number;
  selectedText?: string | number;
  picked: boolean;
}

export const initialState: SelectState = {
  onChange: undefined,
  label: undefined,
  options: [],
  selectedOption: 0,
  selectedText: undefined,
  picked: false,
};

export const selectSlice: any = createSlice({
  name: 'SelectContext',
  initialState,
  reducers: {
    initOption: (state, action: PayloadAction<{ createdAt: number; value: any; text: string | number }>) => {
      if (state.picked) {
        return;
      }

      state.options.push({
        ...action.payload,
        index: state.options.length,
      });
    },
    cleanupOption: (state, action: PayloadAction<number>) => {
      if (state.picked) {
        return;
      }

      state.options = state.options.filter(opt => opt.createdAt !== action.payload);
    },
    updateOption: (state, action: PayloadAction<{ createdAt: number; value: any; text: string | number }>) => {
      if (state.picked) {
        return;
      }

      const option = state.options.find(opt => opt.createdAt === action.payload.createdAt);

      if (option) {
        Object.assign(option, action.payload);
      }
    },
    onUp: state => {
      if (state.picked) {
        return;
      }

      state.selectedOption = Math.max(0, state.selectedOption - 1);

      const selectedOption = getSelectedOption(state);
      selectOption(selectedOption);
    },
    onDown: state => {
      if (state.picked) {
        return;
      }

      state.selectedOption = Math.min(state.options.length - 1, state.selectedOption + 1);

      const selectedOption = getSelectedOption(state);
      selectOption(selectedOption);
    },
    onPick: state => {
      if (state.picked) {
        return;
      }

      const selectedOption = getSelectedOption(state);
      state.selectedText = selectedOption?.text;
      state.picked = true;

      logPicked(state.selectedText, state.label);

      changeSelect(selectedOption?.value, state.onChange);
      pickOption(selectedOption);
    },
    onOptionClick: (state, action: PayloadAction<number>) => {
      if (state.picked) {
        return;
      }

      state.selectedOption = state.options.findIndex(opt => opt.createdAt === action.payload);
      const selectedOption = getSelectedOption(state);

      state.selectedText = selectedOption?.text;
      state.picked = true;

      logPicked(state.selectedText, state.label);

      changeSelect(selectedOption?.value, state.onChange);
      clickOption(selectedOption);
      pickOption(selectedOption);
    },
    reset: (state) => {
      state.picked = initialState.picked;
      state.selectedOption = initialState.selectedOption;
      state.selectedText = initialState.selectedText;
      state.options = initialState.options;
    },
  },
});

export const {
  initOption,
  cleanupOption,
  updateOption,
  onUp,
  onDown,
  onPick,
  onOptionClick,
  reset,
} = selectSlice.actions;
export type SelectActions = typeof selectSlice.actions;

export const selectReducer = selectSlice.reducer;
