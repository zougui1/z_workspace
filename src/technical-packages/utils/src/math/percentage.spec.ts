import { parsePercentage, fromPercent, applyPercentage } from './percentage';

describe('parsePercentage()', () => {
  it('should should return only the number of the percentage', () => {
    const percentage = '45%';
    const result = parsePercentage(percentage);
    expect(result).toEqual(45);
  });
});

describe('fromPercent()', () => {
  it('should 4 when the percentage is 40 and the denominator is 10', () => {
    const percentage = 40;
    const denominator = 10;
    const result = fromPercent(percentage, denominator);
    expect(result).toEqual(4);
  });
});

describe('applyPercentage()', () => {
  it('should 4 when the percentage is 40% and the denominator is 10', () => {
    const percentage = '40%';
    const denominator = 10;
    const result = applyPercentage(percentage, denominator);
    expect(result).toEqual(4);
  });
});
