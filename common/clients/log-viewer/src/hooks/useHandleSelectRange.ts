import { useRef } from 'react';

export const useHandleSelectRange = <TElement extends HTMLElement>(): HandleSelectRange<TElement> => {
  const selectHandlerRef = useRef<TElement | null>(null);

  const onSelectRange = (e: React.KeyboardEvent<TElement>) => {
    if (!selectHandlerRef.current || !e.ctrlKey || e.key !== 'a') {
      return;
    }

    // prevents the default behavior of the range selection
    e.preventDefault();
    const range = document.createRange();
    range.selectNode(selectHandlerRef.current);
    window.getSelection()?.addRange(range);
  }

  return {
    selectHandlerRef,
    onSelectRange,
  };
}

export interface HandleSelectRange<TElement extends HTMLElement> {
  selectHandlerRef: React.MutableRefObject<TElement | null>;
  onSelectRange: (e: React.KeyboardEvent<TElement>) => void;
}
