import { useEffect, useRef } from 'react';
import * as uuid from 'uuid';

import { TabProvider } from './TabContext';
import { TabTitle } from './compounds/TabTitle';
import { TabPanel } from './compounds/TabPanel';
import { useTabsContext, addTab, removeTabById } from '../../TabsContext';

export const Tab = ({ children, value }: TabProps) => {
  const { dispatch } = useTabsContext();
  const defaultId = useRef(uuid.v4());
  const id = value ?? defaultId.current;

  useEffect(() => {
    dispatch(addTab(id));

    return () => {
      dispatch(removeTabById(id));
    }
  }, []);

  return (
    <TabProvider value={id}>
      {children}
    </TabProvider>
  );
}

Tab.Title = TabTitle;
Tab.Panel = TabPanel;

export interface TabProps {
  children: React.ReactNode;
  value?: string | number;
}
