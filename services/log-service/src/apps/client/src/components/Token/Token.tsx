import clsx from 'clsx';
import { ValueOf } from 'type-fest';

import { useStyles } from './Token.styles';

export const Token = ({ token }: TokenProps) => {
  const classes = useStyles();
  const isWhitespace = token === tokenTypes[' '];

  return (
    <span
      className={clsx(classes.root, { [classes.whitespace]: isWhitespace })}
    >
      {token}
    </span>
  );
}

export const tokenTypes = {
  '{': '{',
  '}': '}',
  '[': '[',
  ']': ']',
  ':': ':',
  ',': ',',
  ' ': <>&nbsp;</>,
}

export interface TokenProps {
  token: ValueOf<typeof tokenTypes>;
}
