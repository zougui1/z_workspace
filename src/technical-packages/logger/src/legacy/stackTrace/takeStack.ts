import { getStackTrace } from './getStackTrace';
import { StackTraceCapture } from './StackTraceCapture';
import { StackFrame } from './stack-trace-interfaces';

export const takeStack = (capture: StackTraceCapture, error?: Error): StackFrame[] | StackFrame | undefined => {
  const stack = getStackTrace(error);

  switch (capture) {
    case StackTraceCapture.all:
      return stack;
    case StackTraceCapture.lastStackFrame:
      return stack[stack.length - 1];
  }
}
