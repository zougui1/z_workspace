export const separate = <T>(array: T[], iteratee: (item: T, index: number, source: T[]) => any): [T[], T[]] => {
  const includes: T[] = [];
  const excludes: T[] = [];

  array.forEach((item, index, source) => {
    const canInclude = iteratee(item, index, source);

    if (canInclude) {
      includes.push(item);
    } else {
      excludes.push(item);
    }
  });

  return [includes, excludes];
}
