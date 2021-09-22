import ms, { StringValue } from 'ms';

export const toMs = (time: number | StringValue): number => {
  return typeof time === 'number' ? time : ms(time);
}
