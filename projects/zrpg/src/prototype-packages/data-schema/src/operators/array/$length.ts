import { OperatorContext } from '../OperatorContext';
import { isTestQuery } from '../utils';

export const $length = (ctx: OperatorContext<SizeOperator>): boolean | number | undefined => {
  return isTestQuery(ctx.queryType)
    ? $lengthTest(ctx)
    : $lengthReturn(ctx);
}

const $lengthTest = ({ value, operator }: OperatorContext<SizeOperator>): boolean | number => {
  return Array.isArray(value) || typeof value === 'string'
    ? operator.$length === value.length
    : false;
}

const $lengthReturn = ({ value }: OperatorContext<SizeOperator>): number | undefined => {
  return Array.isArray(value) || typeof value === 'string'
    ? value.length
    : undefined;
}

export interface SizeOperator {
  $length: number | {};
}
