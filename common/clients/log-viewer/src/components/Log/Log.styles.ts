import { grey } from '@material-ui/core/colors';

import { makeStyles } from '@zougui/react-styles';

export const useStyles = makeStyles({
  root: {
    transition: 'border-color .3s',
    borderTop: 'transparent 1px solid',
    borderBottom: 'transparent 1px solid',
  },
  expanded: {
    borderColor: grey[400],
  },
});
