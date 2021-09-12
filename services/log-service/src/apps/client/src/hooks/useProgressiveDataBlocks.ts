import { useState, useMemo, useRef, useEffect } from 'react';

const DEFAULT_ITEMS_PER_BLOCK = 40;

export const useProgressiveDataBlocks = <T>(data: T[], options: ProgressiveDataBlocksOptions = {}): T[][] => {
  const initialData = useRef(data);
  // the blocks of data to render
  // not everything gets rendered at once as it can take a lot of time
  // to render it when there is hundreds of items
  const [blocks, setBlocks] = useState<T[][]>([]);

  const _options = useMemo(() => {
    return {
      itemsPerBlock: DEFAULT_ITEMS_PER_BLOCK,
      ...options,
    };
  }, [options]);

  useEffect(() => {
    // the `setTimeout` with the cooldown is to prevent the page from
    // rendering everything at once which can take time
    const timeout = setTimeout(() => {
      setBlocks(blocks => {
        const currentLines = blocks.length * _options.itemsPerBlock;
        const maxLine = Math.min(currentLines + _options.itemsPerBlock, initialData.current.length);
        const newLines = initialData.current.slice(currentLines, maxLine);

        if (newLines.length) {
          return [...blocks, newLines];
        }

        _options.onDone?.();

        // if no new lines were added then this means
        // it has reached the end, the `blocks` must
        // be returned as is otherwise it will return a new array
        // which will cause this function to be called again and again
        return blocks;
      });

      clearTimeout(timeout);
    }, (blocks.length * _options.itemsPerBlock) / 5);
  }, [blocks, _options]);

  useEffect(() => {
    setBlocks([]);
    initialData.current = data;
  }, [data]);

  return blocks;
}

export interface ProgressiveDataBlocksOptions {
  itemsPerBlock?: number;
  onDone?: () => void;
}
