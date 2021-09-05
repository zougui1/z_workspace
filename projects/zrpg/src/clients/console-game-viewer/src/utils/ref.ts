import { ClassAttributes, MutableRefObject } from 'react';

export const mergeRefs = <T>(ref: MutableRefObject<T>, refToMerge?: ClassAttributes<T>['ref']): ClassAttributes<T>['ref'] | MutableRefObject<T> => {
  if (!ref.current && typeof refToMerge === 'object' && refToMerge?.current) {
    ref.current = refToMerge.current;
  }

  return refToMerge || ref;
}
