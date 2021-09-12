import { useGameDispatch, commonActions } from '@zrpg/game-store';

import { CenterBox } from '../../components/layouts/CenterBox';
import { Select } from '../../components/form/Select';
import { exit } from '../../process';

export const MainScreen = () => {
  const dispatch = useGameDispatch();

  return (
    <CenterBox keys vi label="Main menu">
      <Select children top={1}>
        <Select.Option
          height={1}
          onPick={() => { dispatch(commonActions.createNewGame()) }}
          text="Start a new game"
        />
        <Select.Option
          height={1}
          top={1}
          onPick={() => { console.log('load') }}
          text="Load a game"
        />
        <Select.Option
          height={1}
          top={2}
          onPick={() => exit()}
          text="Exit"
        />
      </Select>
    </CenterBox>
  );
}
