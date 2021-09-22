import { Model } from '../../Model';

export const BelongsToOne = (getType: (() => typeof Model), options?: BelongsToOneOptions) => {
  return function ManyToManyDecorator(target: any, property: string) {
    process.nextTick(() => {
      const TargetModel = target.constructor as typeof Model;
      const targetTableName = TargetModel.tableName;

      const TypeModel = getType();
      const typeTableName = TypeModel.tableName;

      const defaultForeignKey = `${TargetModel.cleanName}_id`;
      const foreignKey = options?.foreignKey || defaultForeignKey;

      const relationship = {
        relation: Model.BelongsToOneRelation,
        modelClass: TypeModel,
        join: {
          from: `${targetTableName}.${foreignKey}`,
          to: `${typeTableName}.id`,
        },
      };

      target.constructor.relationMappings ??= {};
      target.constructor.relationMappings[property] = relationship;
    });
  }
}

export interface BelongsToOneOptions {
  foreignKey?: string;
}
