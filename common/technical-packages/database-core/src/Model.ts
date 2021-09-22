import { Model as ObjectionModel } from 'objection';

import { hookPlugin, connectPlugin, namingStrategyPlugin, jsonVisibilityPlugin } from './plugins';

export const Model = hookPlugin(
  connectPlugin(
    namingStrategyPlugin(
      jsonVisibilityPlugin(ObjectionModel)
    )
  )
);
