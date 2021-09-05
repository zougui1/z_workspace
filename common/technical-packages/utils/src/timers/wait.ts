export const wait = (timeout: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export const waitSync = (timeout: number): void => {
  const start = Date.now();
  let currentInterval = 0;

  while (currentInterval < timeout) {
    currentInterval = Date.now() - start;
  }
}
