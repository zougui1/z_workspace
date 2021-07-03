import { advanceTo, clear } from 'jest-date-mock';

import { getProcessStartDate } from './getProcessStartDate';

describe('getProcessStartDate()', () => {
  it('should return the time at which the process started', () => {
    advanceTo(new Date(4500));

    const uptimeMilliseconds = process.uptime() * 1000;
    const roundedUptime = Math.round(uptimeMilliseconds);
    const startDate = new Date(Date.now() - roundedUptime);

    const processStartDate = getProcessStartDate();

    expect(processStartDate).toEqual(startDate);

    clear();
  });
});
