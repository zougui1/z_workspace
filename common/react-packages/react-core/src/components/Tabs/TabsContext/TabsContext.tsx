import { createContext, useReducer, useMemo } from 'react';

import { tabsReducer, initialState, TabsState, TabsActions } from './tabsSlice';

export type TabsDispatch = (tabsState: ReturnType<TabsActions[keyof TabsActions]>) => void;
export type TabsContext = {
  state: TabsState;
  // TODO replace `dispatch` with an object of the possible actions
  dispatch: TabsDispatch;
}

export const TabsReactContext = createContext<TabsContext | undefined>(undefined);
TabsReactContext.displayName = 'TabsContext';

export const TabsProvider = ({ children }: TabsProviderProps) => {
  const [state, dispatch] = useReducer(tabsReducer, initialState);
  const context = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <TabsReactContext.Provider value={context}>
      {children}
    </TabsReactContext.Provider>
  );
}

export interface TabsProviderProps {
  children: React.ReactNode;
}
