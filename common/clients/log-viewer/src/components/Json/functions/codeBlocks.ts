const reOpeningBrackets = /\{|\[/;
const reClosingBrackets = /\}|\]/;

export const isOpeningBlock = (row: any) => {
  return reOpeningBrackets.test(row?.value) || row.children?.some(isOpeningBlock);
}

export const isClosingBlock = (row: any) => {
  return reClosingBrackets.test(row?.value) || row.children?.some(isClosingBlock);
}
