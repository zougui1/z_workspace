import { useRef, useEffect } from 'react';

export const useOnceChange = <T>(value: T, onWarn: (originalValue: T, newValue: T) => void): void => {
  const originalValue = useRef(value);
  const warned = useRef(false);

  useEffect(() => {
    if (originalValue.current !== value && !warned.current) {
      onWarn(originalValue.current, value);
      warned.current = true;
    }
  }, [value]);
}
