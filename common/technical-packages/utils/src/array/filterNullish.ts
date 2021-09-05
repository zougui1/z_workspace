export const filterNullish = <T>(array: T[]): Exclude<T, undefined | null>[] => {
  return array.filter(item => item !== null && item !== undefined) as Exclude<T, undefined | null>[];
}
