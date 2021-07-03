import _ from 'lodash';

export const extractErrors = (object: Record<string, any>): Record<string, any> => {
  Object.entries(object).forEach(([name, value]) => {
    object[name] = extractError(value);
  });

  return object;
}

const extractError = (value: any): any => {
  if (value instanceof Error) {
    const errorData: any = {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };

    if (_.isObject((value as any).data)) {
      errorData.data = extractError((value as any).data);
    }

    return errorData;
  }

  return value;
}
