import { grey } from '@material-ui/core/colors';

import { makeStyles } from '@zougui/react-styles';

export const useStyles = makeStyles({
  root: {
    display: 'flex',
    width: '100%',
    maxHeight: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  tableContainer: {
    display: 'block',
    maxHeight: '100%',
  },
  table: {
    display: 'block',
    maxHeight: '100%',
  },
  body: {
    display: 'block',
    maxHeight: '100%',
    overflowY: 'auto',
  },
  row: {
    borderBottom: `${grey[500]} 1px solid`,
    display: 'block',
    width: '100%',
  },
  cell: {
    display: 'block',
    width: '100%',
    padding: 0,
    border: 0,
  },
  pagination: {
    overflow: 'hidden',
  },
});
