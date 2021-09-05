export const doTry = <T>(exec: () => T | Promise<T>): TryCatch<T> => {
  const promise = async () => await exec();

  const tryCatch = {
    reject: async (onRejected: (error: any) => Error): Promise<T> => {
      try {
        return await promise();
      } catch (error) {
        throw onRejected(error);
      }
    },
  };

  return tryCatch;
}

export type ErrorConstructor = new (data: { error: any }) => Error;

export interface TryCatch<T> {
  reject(onRejected: (error: any) => Error): Promise<T>;
}
