export const enumerateKeys = <T extends Record<string, any>>(object: T): Record<keyof T, keyof T> => {
  const keys = Object.keys(object) as (keyof T)[];

  return keys.reduce((enumObj, key) => {
    enumObj[key] = key;
    return enumObj;
  }, {} as Record<keyof T, keyof T>);
}
