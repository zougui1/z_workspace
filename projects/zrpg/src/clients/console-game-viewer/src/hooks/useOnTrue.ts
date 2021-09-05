import { useEffect, DependencyList } from 'react';

import { usePrevious } from './usePrevious';

export const useOnTrue = (bool: boolean, callback: () => void, dependencies?: DependencyList) => {
  const prevBool = usePrevious(bool);

  useEffect(() => {
    if (!prevBool && bool) {
      callback();
    }
  }, [prevBool, bool, ...(dependencies || [])]);
}
