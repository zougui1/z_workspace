import { useContext } from 'react';

import { TabReactContext } from './TabContext';

export const useTabContext = (): any => {
  const context = useContext(TabReactContext);

  if (context === undefined) {
    throw new Error('The tab context cannot be used outside of <TabProvider />');
  }

  return context;
}
