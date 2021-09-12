import { useEffect, useRef, EffectCallback, DependencyList } from 'react';

export const useOnAfterMount = (effect: EffectCallback, deps?: DependencyList): void => {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) {
      return effect();
    }

    mounted.current = true;
  }, deps);
}
