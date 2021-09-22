export const mergeDecorators = (...decorators: ((...args: any[]) => any)[]) => {
  return (...args: any[]): void => {
    for (const decorator of decorators) {
      decorator(...args);
    }
  }
}
