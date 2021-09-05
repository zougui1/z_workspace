import { createContext } from 'react';

import { useOnceChange, useConstant } from '@zougui/react-hooks';

export const TabReactContext = createContext<any>(undefined);
TabReactContext.displayName = 'TabContext';

export const TabProvider = ({ value, children }: TabProviderProps) => {
  const constantValue = useConstant(value);

  useOnceChange(value, (originalValue, newValue) => {
    console.warn(new Error(`Tab cannot change of value. previous: "${originalValue}"; next: "${newValue}"`));
  });

  return (
    <TabReactContext.Provider value={constantValue}>
      {children}
    </TabReactContext.Provider>
  );
}

export interface TabProviderProps {
  value: any;
  children: React.ReactNode;
}
