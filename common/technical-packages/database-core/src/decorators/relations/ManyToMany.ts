import { Model } from '../../Model';

export const ManyToMany = (getType: (() => typeof Model)) => {
  return function ManyToManyDecorator(target: any, property: string) {
    process.nextTick(() => {
      const TargetModel = target.constructor as typeof Model;
      const targetTableName = TargetModel.tableName;

      const TypeModel = getType();
      const typeTableName = TypeModel.tableName;

      const pivotTableName = `${targetTableName}_${typeTableName}`;

      const relationship = {
        relation: Model.ManyToManyRelation,
        modelClass: TypeModel,
        join: {
          from: `${targetTableName}.id`,
          through: {
            from: `${pivotTableName}.${TargetModel.cleanName}_id`,
            to: `${pivotTableName}.${TypeModel.cleanName}_id`,
          },
          to: `${typeTableName}.id`,
        },
      };

      target.constructor.relationMappings ??= {};
      target.constructor.relationMappings[property] = relationship;
    });
  }
}
