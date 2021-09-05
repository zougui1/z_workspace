import * as process from './index';

describe('process/index', () => {
  it('should re-export all the process functions', () => {
    expect(process).toHaveProperty('createSpawn');
    expect(process.createSpawn).toBeFunction();

    expect(process).toHaveProperty('execSpawn');
    expect(process.execSpawn).toBeFunction();

    expect(process).toHaveProperty('getProcessStartDate');
    expect(process.getProcessStartDate).toBeFunction();
  });
});
