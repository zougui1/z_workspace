import { Model as ObjectionModel, Pojo } from 'objection';

import { toArray } from '@zougui/utils';

export const jsonVisibilityPlugin = <T extends typeof ObjectionModel>(Model: T): T => {
  return class JsonVisibilityPlugin extends (Model as typeof ObjectionModel) {
    $formatJson(json: Pojo): Pojo {
      json = super.$formatJson(json);

      const hidden = toArray((this.$modelClass as any).hidden).filter(hidden => typeof hidden === 'string');

      for (const hiddenProperty of hidden) {
        delete json[hiddenProperty];
      }

      return json;
    }
  } as any;
}
