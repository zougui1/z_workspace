import { Hook, HookDecorator } from '@foal/core';
import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD hh:mm:ss.SSS A';

export const CreateDate = (): HookDecorator => {
  return Hook(ctx => {
    ctx.request.body.__metadata__ ??= {};
    ctx.request.body.__metadata__.date = moment().format(DATE_FORMAT);
  });
}
