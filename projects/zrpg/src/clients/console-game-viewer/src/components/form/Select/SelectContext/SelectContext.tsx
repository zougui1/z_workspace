import { createContext, useReducer, useMemo } from 'react';

import { selectReducer, initialState, SelectState, SelectActions } from './selectSlice';

export type SelectDispatch = (selectState: ReturnType<SelectActions[keyof SelectActions]>) => void;
export type SelectContext = {
  state: SelectState;
  // TODO replace `dispatch` with an object of the possible actions
  dispatch: SelectDispatch;
}

export const SelectReactContext = createContext<SelectContext | undefined>(undefined);
SelectReactContext.displayName = 'SelectContext';

export const SelectProvider = ({ children, defaultValue }: SelectProviderProps) => {
  const [state, dispatch] = useReducer(selectReducer, defaultValue ?? initialState);
  const context = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <SelectReactContext.Provider value={context as any}>
      {children}
    </SelectReactContext.Provider>
  );
}

export interface SelectProviderProps {
  children: React.ReactNode;
  defaultValue?: SelectState;
}
