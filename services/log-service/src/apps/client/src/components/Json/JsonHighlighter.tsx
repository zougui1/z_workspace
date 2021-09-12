import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { useStyles } from './Json.styles';
import { filterClosedRows, getRowKey } from './functions';
import { CodeRow } from './CodeRow';
import { useToggleMap, useHandleSelectRange } from '../../hooks';

export const Json = ({ data, style }: JsonProps) => {
  const classes = useStyles();
  const [closedBlocks, toggleClosedBlocks] = useToggleMap({});
  const { onSelectRange, selectHandlerRef } = useHandleSelectRange();

  return (
    <SyntaxHighlighter
      language="json"
      showLineNumbers
      style={atomOneDark}
      codeTagProps={{
        className: classes.code,
        style,
        ref: selectHandlerRef,
        onKeyDown: onSelectRange,
        tabIndex: 0,
      }}
      renderer={(data: any) => {
        const rows = filterClosedRows(data.rows, closedBlocks);

        return rows.map((row: any) => (
          <CodeRow
            key={getRowKey(row)}
            row={row}
            data={data}
            isClosed={closedBlocks[getRowKey(row)]}
            onButtonClick={() => toggleClosedBlocks(getRowKey(row))}
          />
        ))
      }}
    >
      {JSON.stringify(data, null, 2)}
    </SyntaxHighlighter>
  )
}

export interface JsonProps {
  data: Record<string, any> | any[];
  style?: React.CSSProperties;
}
