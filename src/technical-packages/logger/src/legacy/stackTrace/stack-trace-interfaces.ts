export interface StackFrame {
  frameString: string;
  file: string;
  fileName: string;
  line: number | undefined;
  column: number | undefined;
  callee: string;
  native: boolean;
  thirdParty: boolean;
}
