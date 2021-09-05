import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';

import { Class } from '@zrpg/game-classes';
import { logger } from '@zrpg/log-http-client';

import { unifyEnemyNames } from './helpers';
import { FightStatus } from './fight-enums';
import { Entity } from './fight-types';

export interface FightState {
  status: FightStatus;
  enemyCounts: Record<string, number | undefined>;
  characters: Entity[];
  enemies: (Entity &  { fightId: string })[];
}

export const initialState: FightState = {
  status: FightStatus.idle,
  enemyCounts: {},
  characters: [],
  enemies: [],
};

export const fightSlice = createSlice({
  name: 'fight',
  initialState,
  reducers: {
    startFight: (state, action: PayloadAction<{ characters: Entity[]; enemies: Entity[] }>) => {
      const enemyGroups = _.groupBy(action.payload.enemies, enemy => enemy.id);
      const enemies = unifyEnemyNames(enemyGroups);

      for (const [groupId, group] of Object.entries(enemyGroups)) {
        state.enemyCounts[groupId] = group.length;
      }

      state.status = FightStatus.fighting;
      state.characters = action.payload.characters;
      state.enemies = enemies;
    },

    attackEnemy: (state, action: PayloadAction<{ character: string; targets: string[] }>) => {
      const character = state.characters.find(char => char.id === action.payload.character);

      logger.log(`${action.payload.character} attacks ${action.payload.targets.join(', ')}`);

      if (!character) {
        return;
      }

      const targets = action.payload.targets.map(target => state.enemies.find(enemy => enemy.fightId === target));

      for (const target of targets) {
        if (!target) {
          continue;
        }

        target.stats.health = Math.max(0, target.stats.health - character.stats.strength);
      }
    },

    endFight: () => {
      return initialState;
    },
  },
});

export const fightReducer = fightSlice.reducer;
export const fightActions = fightSlice.actions;
export type { Class };
