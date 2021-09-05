import { useEffect } from 'react';
import { PaperProps } from '@material-ui/core';

import { useTabContext } from '../../TabContext';
import { useTabsContext, addTabPanel } from '../../../../TabsContext';

export const TabPanel = (props: TabPanelProps) => {
  const tabId = useTabContext();
  const { dispatch } = useTabsContext();

  useEffect(() => {
    const tab = {
      tabPanel: props,
      id: tabId,
    };

    dispatch(addTabPanel(tab));
  }, [props]);

  return <></>;
}

export interface TabPanelProps extends PaperProps {}
