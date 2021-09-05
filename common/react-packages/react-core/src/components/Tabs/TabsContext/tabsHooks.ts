import { useContext } from 'react';

import { TabsReactContext, TabsContext } from './TabsContext';

export const useTabsContext = (): TabsContext => {
  const context = useContext(TabsReactContext);

  if(!context) {
    throw new Error('Cannot use the tabs context outside of <TabsProvider />');
  }

  return context;
}
