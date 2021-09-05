import { BlessedIntrinsicElements } from 'react-blessed';

import { CustomTextStyle } from './components/Text';

export type BlessedElementsProps = BlessedIntrinsicElements[keyof BlessedIntrinsicElements];
//type BlessedElementsStyle = BlessedElementsProps['style'];
//type BlessedElementsBorder = BlessedElementsProps['border'];
export type BlessedElementClass = BlessedElementsProps['class'];
//type BorderStyle = BlessedElementsBorder & BlessedElementsStyle['border'] & { fg: string };
export interface BorderStyle {
  type?: "line" | "bg";
  ch?: string;
  bg?: string;
  fg?: string;
  bold?: boolean;
  underline?: boolean;
}

export interface Border {
  /**
   * Type of border (line or bg). bg by default.
   */
  type?: "line" | "bg" | undefined;

  /**
   * Character to use if bg type, default is space.
   */
  ch?: string | undefined;

  /**
   * Border foreground and background, must be numbers (-1 for default).
   */
  bg?: number | undefined;
  fg?: number | undefined;

  /**
   * Border attributes.
   */
  bold?: string | undefined;
  underline?: string | undefined;
}

export type FinalStyle = Omit<BlessedElementClass, 'border'> & { border?: Border };
export type Style = Omit<BlessedElementClass, 'border'> & { border?: BorderStyle } & CustomTextStyle;

export const makeStyles = <T extends Record<string, Style>>(styles: T): Record<keyof T, FinalStyle> => {
  return styles as any;
}
