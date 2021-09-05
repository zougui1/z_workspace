import { useEffect } from 'react';
import { TabProps } from '@material-ui/core';

import { useTabContext } from '../../TabContext';
import { useTabsContext, addTabTitle } from '../../../../TabsContext';

export const TabTitle = (props: TabTitleProps) => {
  const tabId = useTabContext();
  const { dispatch } = useTabsContext();

  useEffect(() => {
    const { children, ...titleProps } = props;

    const tab = {
      tabTitle: {
        ...titleProps,
        label: children,
      },
      id: tabId,
    };

    dispatch(addTabTitle(tab));
  }, [props]);

  return <></>;
}

export interface TabTitleProps extends Omit<TabProps, 'label'> {
  children: React.ReactNode;
}
