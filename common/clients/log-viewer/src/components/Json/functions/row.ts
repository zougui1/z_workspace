import { isOpeningBlock, isClosingBlock } from './codeBlocks';

export const getRowKey = (row: any) => {
  return row.children?.[0]?.properties?.key ?? row.properties?.key ?? row.value;
}

export const filterClosedRows = (rows: any[], closedBlocks: Record<string, boolean>) => {
  let openBlocksCount = 0;
  return rows.filter((row: any) => {
    if (isOpeningBlock(row)) {
      if (!openBlocksCount) {
        if (closedBlocks[getRowKey(row)]) {
          openBlocksCount++;
          return true;
        }
      } else {
        openBlocksCount++;
      }
    } else if (isClosingBlock(row)) {
      openBlocksCount = Math.max(0, openBlocksCount - 1);
    }

    return !openBlocksCount;
  });
}
