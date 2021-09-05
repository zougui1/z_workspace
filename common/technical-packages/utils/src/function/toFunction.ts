export const toFunction = <T, TArgs extends any[]>(value: T | ((...args: TArgs) => T)): ((...args: TArgs) => T) => {
  return typeof value === 'function'
    ? value as (...args: TArgs) => T
    : (...args: TArgs) => value;
}
