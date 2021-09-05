import { useEffect, useRef, ClassAttributes } from 'react';
import { Widgets } from 'blessed';
import { BlessedIntrinsicElements } from 'react-blessed';

import { mergeRefs } from '../../../utils';

export const TextField = ({ autoFocus, trim, noEmpty, ...props }: TextFieldProps) => {
  const textbox = useRef<Widgets.TextboxElement | null>(null);
  mergeRefs(textbox, props.ref);

  useEffect(() => {
    if (autoFocus) {
      textbox.current?.focus();
    }
  }, [autoFocus]);

  const onSubmit = (value: string) => {
    if (noEmpty && !value.trim()) {
      return;
    }

    props.onSubmit?.(trim ? value.trim() : value);
  }

  return (
    <textbox
      {...props}
      ref={props.ref || textbox}
      onSubmit={onSubmit}
      inputOnFocus={props.inputOnFocus ?? true}
      keys={props.keys ?? true}
      mouse={props.mouse ?? true}
      // @ts-ignore
      focused={props.focused ?? false}
    />
  );
}

interface ITextFieldProps {
  autoFocus?: boolean;
  inputRef?: ClassAttributes<Widgets.TextboxElement>['ref'];
  onSubmit?: (value: string) => void;
  noEmpty?: boolean;
  trim?: boolean;
}

export type TextFieldProps = ITextFieldProps & BlessedIntrinsicElements['textbox'];
