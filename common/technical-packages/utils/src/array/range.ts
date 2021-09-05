export const range = (start: number, end?: number, step: number = 1): number[] => {
  let _start: number = start;
  let _end: number = end ?? start;

  if (typeof end !== 'number') {
    _end = start;
    _start = 0;
  }

  const array: number[] = [];

  for (let i = _start; i < _end; i += step) {
    array.push(i);
  }

  return array;
}
