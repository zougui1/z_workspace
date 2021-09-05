import { useEffect, useState } from 'react';

import { RenderTabs, RenderTabsProps } from './RenderTabs';
import { TabsProvider } from './TabsContext';
import { Tab } from './compounds/Tab';

export const Tabs = ({ children, value: controlledValue, onChange: controlledOnChange, defaultIndex, ...props }: TabsProps) => {
  const [value, setValue] = useState(controlledValue);

  useEffect(() => {
    setValue(controlledValue);
  }, [controlledValue]);

  const onChange = (event: React.ChangeEvent<{}>, value: any) => {
    if (controlledOnChange) {
      controlledOnChange(event, value);
    } else {
      setValue(value);
    }
  }

  return (
    <TabsProvider>
      <RenderTabs {...props} onChange={onChange} defaultIndex={defaultIndex ?? 0} value={value} />
      {children}
    </TabsProvider>
  );
}

Tabs.Tab = Tab;

export interface TabsProps extends Omit<RenderTabsProps, 'defaultIndex'> {
  defaultIndex?: number;
}
