import { createElement } from 'react-syntax-highlighter';
import clsx from 'clsx';
import { IconButton } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import { useStyles } from './CodeRow.styles';
import { isOpeningBlock } from '../functions';

const createRow = ({ row, ...data }: any) => {
  return createElement({
    ...data,
    node: row,
    //key: row.properties.key
  });
}

export const CodeRow = ({ row, data, isClosed, onButtonClick }: CodeRowProps) => {
  const classes = useStyles();

  const isOpening = isOpeningBlock(row);

  return (
    <div className={clsx(classes.root, { [classes.closed]: isClosed })}>
      <IconButton disabled={!isOpening} className={classes.collapseButton} onClick={onButtonClick}>
        {isOpening && (isClosed ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />)}
      </IconButton>

      {createRow({...data,row})}
    </div>
  );
}

export interface CodeRowProps {
  data: Record<string, any>;
  row: Record<string, any>;
  isClosed?: boolean;
  onButtonClick: () => void;
}
