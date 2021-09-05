import { getLetter } from '@zougui/utils';

import { Entity } from '../fight-types';

export const unifyEnemyNames = (enemyGroups: Record<string, Entity[]>): (Entity & { fightId: string })[] => {
  return Object.values(enemyGroups).flatMap(group => {
    return group.map((enemy, i) => {
      if (group.length <= 1) {
        return {
          ...enemy,
          fightId: enemy.id,
        };
      }

      const letterId = getLetter(i);

      return {
        ...enemy,
        name: `${enemy.name} ${letterId}`,
        fightId: `${enemy.id}-${letterId}`,
      };
    });
  });
}
