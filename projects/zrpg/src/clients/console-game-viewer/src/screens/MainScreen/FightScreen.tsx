import { useEffect, useState } from 'react';

import { useGameDispatch, useGameSelector, fightActions, Entity } from '@zrpg/game-store';

import { CenterBox } from '../../components/layouts/CenterBox';
import { Select } from '../../components/form/Select';

const charactersData: Entity[] = [
  {
    id: 'warrior',
    name: 'Zougui',
    stats: {
      health: 15,
      mana: 0,
      strength: 6,
      resistance: 3,
      magicalMight: 0,
      magicalMending: 0,
      agility: 2,
      deftness: 3
    }
  }
];

const enemiesData: Entity[] = [
  {
    id: 'zrpg:slime',
    name: 'Slime',
    stats: {
      health: 9,
      mana: 0,
      strength: 3,
      resistance: 3,
      magicalMight: 0,
      magicalMending: 0,
      agility: 2,
      deftness: 3
    }
  },
  {
    id: 'zrpg:slime',
    name: 'Slime',
    stats: {
      health: 9,
      mana: 0,
      strength: 3,
      resistance: 3,
      magicalMight: 0,
      magicalMending: 0,
      agility: 2,
      deftness: 3
    }
  }
]

export const MainScreen = () => {
  const dispatch = useGameDispatch();
  const characters = useGameSelector(state => state.fight.characters);
  const enemies = useGameSelector(state => state.fight.enemies);
  const [choice, setChoice] = useState<string | undefined>();

  useEffect(() => {
    dispatch(fightActions.startFight({
      characters: charactersData,
      enemies: enemiesData
    }));
  }, []);

  const onAttack = () => {
    if (enemies.length > 1) {
      //setChoice('attack');
    } else {
      attack([enemies[0]?.fightId]);
    }
  }

  const attack = (targets: string[]) => {
    setChoice('');
    dispatch(fightActions.attackEnemy({
      character: characters[0]?.id,
      targets,
    }));
  }

  const onFightSelectChange = (value: string) => {
    setChoice(value);
  }

  return (
    <CenterBox keys vi label="Fight menu">
      <Select children top={1} onChange={onFightSelectChange} value={choice} label="What do you want to do?">
        <Select.Option
          height={1}
          onPick={onAttack}
          value="attack"
          text="Attack"
        />
      </Select>

      {choice === 'attack' && (
        <Select children top={2} height={4} label="Pick a target">
          {enemies.map((enemy, i) => (
            <Select.Option
              key={enemy.fightId}
              height={1}
              top={i}
              onPick={() => attack([enemy.fightId])}
              text={enemy.name}
            />
          ))}
        </Select>
      )}

      <box top={8}>
        {enemies.map((enemy, i) => (
          <text key={enemy.fightId} top={i}>
            {`${enemy.name}: ${enemy.stats.health}`}
          </text>
        ))}
      </box>
    </CenterBox>
  );
}
