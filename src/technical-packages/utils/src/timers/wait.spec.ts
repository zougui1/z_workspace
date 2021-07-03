import { wait, waitSync } from './wait';

describe('wait()', () => {
  it('should asynchronously wait for 5 milliseconds before resolving', async () => {
    const promise = wait(5);
    expect(promise).toBeInstanceOf(Promise);
    await promise;
  });
});

describe('waitSync()', () => {
  it('should synchronously wait for 5 milliseconds before returning', () => {
    const result = waitSync(5);
    expect(result).toBeUndefined();
  });
});
