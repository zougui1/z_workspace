import { Model } from '../../Model';

export const HasMany = (getRelatedModel: (() => typeof Model), options?: HasManyptions) => {
  return function ManyToManyDecorator(target: any, property: string) {
    process.nextTick(() => {
      const TargetModel = target.constructor as typeof Model;
      const targetTableName = TargetModel.tableName;

      const RelatedModel = getRelatedModel();
      const relatedTableName = RelatedModel.tableName;

      const defaultRelatedForeignKey = `${TargetModel.cleanName}_id`;
      const relatedForeignKey = options?.relatedForeignKey || defaultRelatedForeignKey;

      const relationship = {
        relation: Model.HasManyRelation,
        modelClass: RelatedModel,
        join: {
          from: `${targetTableName}.id`,
          to: `${relatedTableName}.${relatedForeignKey}`,
        },
      };

      target.constructor.relationMappings ??= {};
      target.constructor.relationMappings[property] = relationship;
    });
  }
}

export interface HasManyptions {
  relatedForeignKey?: string;
}
