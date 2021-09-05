export const getType = (value: any): 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | 'null' | 'array' | 'date' | 'regexp' => {
  if(value === null) {
    return 'null';
  } else if (Array.isArray(value)) {
    return 'array';
  } else if (value instanceof Date) {
    return 'date';
  } else if (value instanceof RegExp) {
    return 'regexp';
  }

  return typeof value;
}
