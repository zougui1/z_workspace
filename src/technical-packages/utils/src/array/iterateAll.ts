export const iterateAll = <T>(iterator: IterableIterator<T>): T[] => {
  const items: T[] = [];

  for (const item of iterator) {
    items.push(item);
  }

  return items;
}
