import { logger } from '@zrpg/log-http-client';

import { Option, SelectState } from './selectSlice';

export const selectOption = (option: Option | undefined) => {
  delayAction(option?.value, option?.onSelect);
}

export const clickOption = (option: Option | undefined) => {
  delayAction(option?.value, option?.onClick);
}

export const pickOption = (option: Option | undefined) => {
  delayAction(option?.value, option?.onPick);
}

export const changeSelect = (value: any, onChange: ((value: any) => void) | undefined) => {
  delayAction(value, onChange);
}

const delayAction = (value: any, action: ((value: any) => void) | undefined) => {
  // the call MUST be delayed, it can cause issues with hooks call
  // when the `action` do something that unmounts the component
  process.nextTick(() => action?.(value));
}

export const getSelectedOption = (state: SelectState): Option | undefined => {
  return state.options[state.selectedOption];
}

export const logPicked = (selectedText: string | number | undefined, label: string | undefined) => {
  const selectLabel = label || 'NO_LABEL';
  logger.log(`Select: ${selectLabel} = ${selectedText}`);
}
