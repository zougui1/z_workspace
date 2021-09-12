import { BlessedIntrinsicElements } from 'react-blessed';
import _ from 'lodash';

import { classes } from './CenterBox.styles';

export const CenterBox = ({ children, ...props }: CenterBoxProps) => {
  return (
    <box {...props} class={_.merge(classes.root, props.class)}>
      {children}
    </box>
  );
}

export type CenterBoxProps = BlessedIntrinsicElements['box'];
