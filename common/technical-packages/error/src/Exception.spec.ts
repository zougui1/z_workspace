import { Exception } from './Exception';

describe('new Exception()', () => {
  it('should construct an error object with a code and details', () => {
    const message = 'my message';
    const code = 'my code';
    const details = 'my details';

    const exception = new Exception(message, code, details);

    expect(exception.message).toBe(message);
    expect(exception.code).toBe(code);
    expect(exception.details).toBe(details);
    expect(exception).toHaveProperty('stack');
  });
});
