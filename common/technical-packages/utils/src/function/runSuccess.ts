export function runSuccess<T>(exec: () => T, callback: (result: T) => any): T;
export function runSuccess<T>(exec: () => Promise<T>, callback: (result: T) => any): T;
export function runSuccess<T>(exec: () => T | Promise<T>, callback: (result: T) => any): T | Promise<T>;
export function runSuccess<T>(exec: () => T, callback: (result: T) => any): T | Promise<T> {
  const res = exec();

  if (typeof (res as any).then === 'function') {
    return (res as any).then(async (res: T) => {
      await callback(res);
      return res;
    });
  }

  callback(res);
  return res;
}
