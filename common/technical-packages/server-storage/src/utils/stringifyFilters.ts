export const stringifyFilters = (filters: Record<string, string | number>): string => {
  return Object
    .entries(filters)
    .map(([name, value]) => `${name}-${value}`)
    .join('_');
}
