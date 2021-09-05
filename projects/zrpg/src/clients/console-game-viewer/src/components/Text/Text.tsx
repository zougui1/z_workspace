import { BlessedIntrinsicElements } from 'react-blessed';
import _ from 'lodash';

import { applyStyles } from './helpers';
import { FinalStyle } from '../../makeStyles';

export const Text = ({ style, text, ...props }: TextProps) => {
  text = applyStyles(text, _.merge({}, props.class, style));

  return (
    <text {...props}>
      {text}
    </text>
  );
}

export type CustomTextStyle = {
  color?: string;
  backgroundColor?: string;
};

export type TextStyle = FinalStyle & CustomTextStyle;

interface ITextProps {
  text?: string | number;
  style?: CustomTextStyle;
  class?: TextStyle;
}

export type TextProps = BlessedIntrinsicElements['text'] & ITextProps;
