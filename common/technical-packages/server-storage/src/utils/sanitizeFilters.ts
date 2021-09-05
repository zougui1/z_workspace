export const sanitizeFilters = (filters: Record<string, string | number | undefined | null>): Record<string, string | number> => {
  const cleanFilters: Record<string, string | number> = {};

  for (const [name, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null) {
      cleanFilters[name] = value;
    }
  }

  return cleanFilters;
}
