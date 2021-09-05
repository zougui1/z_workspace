import { range } from '@zougui/utils';

import { Token, tokenTypes } from '../Token';

const spacesPerIndent = 2;

export const SpaceIndent = ({ indentLevel = 0 }: SpaceIndentProps) => {
  return (
    <>
      {range(indentLevel * spacesPerIndent).map(num => (
        <Token key={num} token={tokenTypes[' ']} />
      ))}
    </>
  );
}

export interface SpaceIndentProps {
  indentLevel?: number;
}
