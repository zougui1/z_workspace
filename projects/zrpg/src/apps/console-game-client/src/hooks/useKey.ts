import { useEffect, DependencyList } from 'react';

import { screen } from '../screen';

export const useKey = (key: string | string[], callback: () => void, dependencies?: DependencyList) => {
  useEffect(() => {
    screen.key(key, callback);

    return () => {
      const keys = Array.isArray(key) ? key : [key];

      for (const key of keys) {
        screen.removeKey(key, callback);
      }
    }
  }, dependencies);
}
