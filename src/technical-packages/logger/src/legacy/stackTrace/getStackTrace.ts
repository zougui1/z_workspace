import StackTracey from 'stacktracey';
import cleanStack from 'clean-stack';

import { StackFrame } from './stack-trace-interfaces';
import { SOURCE_DIR, PROJECT_ROOT_SRC_DIR } from '../constants';

export const getStackTrace = (error?: Error): StackFrame[] => {
  const stack = new StackTracey(error?.stack ? cleanStack(error.stack) : undefined);
  const filteredStack = stack.filter(frame => !frame.file.startsWith(SOURCE_DIR));
  const relevantStack = filteredStack.items.length > 0 ? filteredStack : stack.filter((f, i) => !i);
  const frames = relevantStack.items.map(getStackFrame);

  return frames;
}

const getStackFrame = (frame: StackTracey.Entry): StackFrame => {
  return {
    frameString: frame.beforeParse.replace(`${PROJECT_ROOT_SRC_DIR}/`, ''),
    file: frame.file,
    fileName: frame.fileName,
    line: frame.line,
    column: frame.column,
    callee: frame.callee,
    native: frame.native,
    thirdParty: frame.thirdParty,
  };
}
