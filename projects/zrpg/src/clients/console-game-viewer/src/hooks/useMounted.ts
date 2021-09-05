import { useEffect, useRef, RefObject } from 'react';

export const useMounted = (): RefObject<boolean> => {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
  }, []);

  return mounted;
}
