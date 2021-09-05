import { BlessedIntrinsicElements } from 'react-blessed';
import { Widgets } from 'blessed';
import _ from 'lodash';

import { classes } from './Button.styles';
import { Text } from '../../Text';

export const Button = ({ disabled, text, ...props }: ButtonProps) => {
  const onClick = (screen: Widgets.Screen) => {
    if (!disabled) {
      props.onClick?.(screen);
    }
  }

  return (
    <button
      {...props}
      mouse
      onClick={onClick}
      class={_.merge({}, classes.root, disabled && classes.disabled)}
    >
      <Text class={_.merge({}, disabled && classes.textDisabled)} text={text} />
    </button>
  );
}

interface IButtonProps {
  disabled?: boolean;
  text?: string | number;
}

export type ButtonProps = IButtonProps & BlessedIntrinsicElements['button'];
