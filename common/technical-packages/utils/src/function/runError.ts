export const runError = <T>(exec: () => T, callback: (error: any) => void): T => {
  let res: T;

  try {
    res = exec();
  } catch (error) {
    callback(error);
    throw error;
  }

  if (typeof (res as any).catch === 'function') {
    return (res as any).catch(callback);
  }

  return res;
}
