import { BlessedIntrinsicElements } from 'react-blessed';

import { logger } from '@zrpg/log-http-client';

import { useSelectContext, onUp, onDown, onPick, reset } from '../SelectContext';
import { Text } from '../../../Text';
import { useKey, useOnAfterMount } from '../../../../hooks';
import { symbols } from '../../../../symbols';

export const Selector = ({ children, value, label, ...props }: SelectorProps) => {
  const { state, dispatch } = useSelectContext();

  useKey('up', () => {
    dispatch(onUp());
  }, []);

  useKey('down', () => {
    dispatch(onDown());
  }, []);

  useKey('enter', () => {
    dispatch(onPick());
  }, []);

  useOnAfterMount(() => {
    if (value === '') {
      logger.log(label + ': value emptied')
      dispatch(reset());
    }
  }, [value]);

  return (
    <box {...props}>
      {label && (
        <box>
          <text>{label}</text>
          {state.picked && state.selectedText && (
            <Text left={label.length + 1} style={{ color: 'green' }} text={`${symbols.check} (${state.selectedText})`} />
          )}
        </box>
      )}

      {!state.picked && (
        <box top={label ? 1 : 0}>
          {children}
        </box>
      )}
    </box>
  );
}

interface ISelectorProps {
  value?: any;
}

export type SelectorProps = ISelectorProps & BlessedIntrinsicElements['box'];
