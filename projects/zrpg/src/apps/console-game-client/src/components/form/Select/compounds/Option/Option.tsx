import { useRef, useEffect } from 'react';
import { BlessedIntrinsicElements } from 'react-blessed';
import _ from 'lodash';

import { classes } from './Option.styles';
import { useSelectContext, initOption, cleanupOption, updateOption, onOptionClick } from '../../SelectContext';
import { Text, TextStyle } from '../../../../Text';
import { FinalStyle } from '../../../../../makeStyles';
import { symbols } from '../../../../../symbols';

export const Option = ({ value, onSelect, onClick, onPick, text, ...props }: OptionProps) => {
  const createdAt = useRef(process.hrtime()[1]);
  const { state, dispatch } = useSelectContext();
  const currentOptions = state.options.find(opt => opt.createdAt === createdAt.current);
  const isSelected = currentOptions?.index === state.selectedOption;

  useEffect(() => {
    dispatch(initOption({
      value,
      text,
      onSelect,
      onClick,
      onPick,
      createdAt: createdAt.current,
    }));

    return () => {
      dispatch(cleanupOption(createdAt.current));
    }
  }, []);

  useEffect(() => {
    dispatch(updateOption({
      value,
      text,
      onSelect,
      onClick,
      onPick,
      createdAt: createdAt.current,
    }));
  });

  const handleClick = () => {
    dispatch(onOptionClick(createdAt.current));
  }

  const textSelectedClass = _.merge({}, classes?.textSelected, props.classes?.textSelected);
  const textClass = _.merge({}, props.classes?.text, isSelected && textSelectedClass);

  return (
    <button
      {...props}
      class={_.merge({}, props.class, props.classes?.root, isSelected && props.classes?.selected)}
      mouse
      onClick={handleClick}
    >
      {isSelected && (
        <>
          <Text
            class={_.merge({}, textClass, { underline: false } as any)}
            text={symbols.pointer}
          />
        </>
      )}

      <Text
        left={2}
        class={textClass}
        text={text}
      />
    </button>
  );
}

interface IOptionProps {
  onSelect?: (value: any) => void;
  onClick?: (value: any) => void;
  onPick?: (value: any) => void;
  value?: any;
  classes?: Partial<Record<'root' | 'selected', FinalStyle>> & Partial<Record<'text' | 'textSelected', TextStyle>>;
  text: string | number;
}

export type OptionProps = BlessedIntrinsicElements['button'] & IOptionProps;
