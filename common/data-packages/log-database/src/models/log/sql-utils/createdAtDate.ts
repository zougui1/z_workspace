import { raw, RawBuilder } from 'objection';

export const createdAtDate = (): RawBuilder => {
  return raw('STR_TO_DATE(createdAt, "%Y-%m-%d %h:%i:%s.%f %p")');
}
