import { Hook, HookDecorator, Context, HttpResponse } from '@foal/core';
import { ObjectSchema, AsyncValidationOptions } from 'joi';

const defaultOptions: AsyncValidationOptions = {
  abortEarly: false,
  allowUnknown: true,

};

export const createHookValidator = (key: 'body' | 'params' | 'query', getValidationErrorHttpResponse: GetValidationErrorHttpResponse) =>  (schema: ObjectSchema, options: AsyncValidationOptions = {}): HookDecorator => {
  const _options: AsyncValidationOptions = {
    ...defaultOptions,
    ...options,
  };

  return Hook(async ctx => {
    try {
      const validated = await schema.validateAsync(ctx.request[key], _options);
      console.log('validated', validated)
      ctx.request[key] = validated;
    } catch (error: any) {
      // a copy is needed to have an enumerable message
      const errObj = { ...error };
      errObj.message = error.message;

      return getValidationErrorHttpResponse(errObj, error);
    }
  });
}

export type GetRequestInput = (request: Context['request']) => Record<string, any>;
export type GetValidationErrorHttpResponse = (enumerableError: any, originalError: any) => HttpResponse;
