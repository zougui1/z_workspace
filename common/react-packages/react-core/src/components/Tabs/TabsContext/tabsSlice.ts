import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Tab {
  id: string | number;
  tabPanel?: Record<string, any>;
  tabTitle?: Record<string, any>;
}

export interface TabsState {
  tabs: Record<string, Tab>;
}

export const initialState: TabsState = {
  tabs: {},
};

export const tabsSlice = createSlice({
  name: 'TabsContext',
  initialState,
  reducers: {
    // the tab must be created by any of the `add` action, since the deepest
    // component is the one to be mounted first, both the tab panel or the tab title
    // component will be mounted before the tab component, thus their actions will be called
    // before the action `addTab`
    addTab: (state, action: PayloadAction<string | number>) => {
      const id = action.payload;

      state.tabs[id] ??= { id };
    },
    addTabTitle: (state, action: PayloadAction<{ id: string | number; tabTitle: Record<string, any> }>) => {
      const { id, tabTitle } = action.payload;

      state.tabs[id] ??= { id };
      state.tabs[id].tabTitle = tabTitle;
    },
    addTabPanel: (state, action: PayloadAction<{ id: string | number; tabPanel: Record<string, any> }>) => {
      const { id, tabPanel } = action.payload;

      state.tabs[id] ??= { id };
      state.tabs[id].tabPanel = tabPanel;
    },
    removeTabById: (state, action: PayloadAction<string | number>) => {
      delete state.tabs[action.payload];
    },
  },
});

export const {
  addTab,
  addTabTitle,
  addTabPanel,
  removeTabById,
} = tabsSlice.actions;

export const tabsReducer = tabsSlice.reducer;

export type TabsActions = typeof tabsSlice.actions;
