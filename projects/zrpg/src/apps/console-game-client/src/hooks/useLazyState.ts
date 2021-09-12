import { useState, useEffect, SetStateAction, Dispatch } from 'react';

export const useLazyState = <T>(lazyDefaultValue: T): [T | undefined, Dispatch<SetStateAction<T | undefined>>] => {
  const [value, setValue] = useState<T | undefined>();

  useEffect(() => {
    if (lazyDefaultValue && value === undefined) {
      setValue(lazyDefaultValue);
    }
  }, [lazyDefaultValue]);

  return [value, setValue];
}
