import { useGameSelector } from '@zrpg/game-store';

import { classes } from './ScreenNotFound.styles';
import { CenterBox } from '../../components/layouts/CenterBox';

export const ScreenNotFound = () => {
  const screen = useGameSelector(state => state.view.screen);

  return (
    <CenterBox label="Screen not found" class={classes.root}>
      <text>Tried to go to an unknown screen.</text>
      <text class={classes.screen}>Screen: {screen}</text>

      {process.env.NODE_ENV === 'development' && (
        <text class={classes.todo}>TODO: Be able to restart the game from here</text>
      )}
    </CenterBox>
  );
}
