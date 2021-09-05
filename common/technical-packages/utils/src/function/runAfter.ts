export const runAfter = <T>(exec: () => T, callback: () => void): T => {
  const res = exec();

  if (typeof (res as any).then === 'function' && typeof (res as any).finally === 'function') {
    return (res as any).finally(callback);
  }

  callback();
  return res;
}
