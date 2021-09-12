import { useState } from 'react';

import { useGameSelector, Class } from '@zrpg/game-store';
import { logger } from '@zrpg/log-http-client';

import { CenterBox } from '../../components/layouts/CenterBox';
import { Select } from '../../components/form/Select';
import { TextField } from '../../components/form/TextField';
import { Form } from '../../components/form/Form';
import { Button } from '../../components/form/Button';
import { useLazyState } from '../../hooks';

export const StartNewGameScreen = () => {
  const [characterClass, setCharacterClass] = useState<Class>();
  const [username, setUsername] = useState<string>('');

  const classes = useGameSelector(state => state.client.classes.filter(classData => classData.available === 'always'));
  const [selectedClass, setSelectedClass] = useLazyState<Class>(classes[0]);

  const start = () => {
    logger.log(`new character: ${username} ${characterClass?.className}`);
  }

  const onUsername = (name: string) => {
    const cleanName = name.trim();

    if (cleanName) {
      setUsername(cleanName);
    }
  }

  return (
    <CenterBox label="New game">
      <box width="50%" top={1}>
        <Select children label="Choose a class:">
          {classes.map((classData, i) => (
            <Select.Option
              key={classData.id}
              height={1}
              top={i}
              onPick={() => setCharacterClass(classData)}
              onSelect={() => setSelectedClass(classData)}
              text={classData.className}
            />
          ))}
        </Select>

        {characterClass && (
          <Form top={1} onSubmit={start}>
            <box>
              <text>Username: </text>
              <TextField
                onSubmit={onUsername}
                left={10}
                width="60%"
                height={1}
                autoFocus
                style={{ bg: '#363636' }}
              />
            </box>
          </Form>
        )}
      </box>

      <box left="50%" width="50% - 1" top={1}>
        <box>
          {Object.entries(selectedClass?.stats || []).map(([name, value], i) => (
            <box key={name} top={i}>
              <text>{name}</text>
              <text left={name.length}>:</text>
              <text left={name.length + 2}>{value}</text>
            </box>
          ))}

          <Button
            disabled={!username}
            bottom={0}
            left={32}
            width={10}
            height={3}
            onClick={start}
            text="Start"
          />
        </box>
      </box>
    </CenterBox>
  );
}
