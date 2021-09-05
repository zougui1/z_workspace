import { useContext } from 'react';

import { SelectReactContext, SelectContext } from './SelectContext';

export const useSelectContext = (): SelectContext => {
  const context = useContext(SelectReactContext);

  if(!context) {
    throw new Error('Cannot use the select context outside of <SelectProvider />');
  }

  return context;
}
