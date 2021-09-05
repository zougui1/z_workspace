import { useRef } from 'react';

/**
 * ensures the value is never changed across renders
 */
export const useConstant = <T>(value: T): T => {
  const constant = useRef(value);
  return constant.current;
}
