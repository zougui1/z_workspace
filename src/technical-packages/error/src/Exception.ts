export interface IConstructedError<TData extends Record<string, any> = any> extends Error {
  data: TData;
  status?: number;
  code: string;
}

export class PartialException<T extends Record<string, any> = any> extends Error implements IConstructedError<T> {
  data: T;
  code: string;
  status?: number;

  constructor(errorData: { message: string; code: string; status?: number; data: T }) {
    super(errorData.message);

    this.code = errorData.code;
    this.status = errorData.status;
    this.data = errorData.data;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class Exception<T extends Record<string, any> = any> {

  public message?: string;
  public code?: string;
  public status?: number;

  setMessage(message: string): this {
    this.message = message;
    return this;
  }

  setCode(code: string): this {
    this.code = code;
    return this;
  }

  setStatus(status: number): this {
    this.status = status;
    return this;
  }

  toClass() {
    const { code, status, message, constructor } = this;

    if (!code) {
      throw new Error('The code is missing.');
    }

    if (!message) {
      throw new Error('The message is missing.');
    }

    const actualCode = code ?? 'error.unknown';

    return class Exception<TData extends T = T> extends PartialException<TData> {
      static readonly code: string = actualCode;
      static readonly status?: number = status;

      constructor(data: TData) {
        super({
          message: message || 'No message provided',
          code: actualCode,
          status,
          data,
        });

        this.name = constructor.name;
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
}
