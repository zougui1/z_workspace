import { alpha } from '@material-ui/core/styles';
import { grey, blueGrey } from '@material-ui/core/colors';

import { makeStyles } from '@zougui/react-styles';

export const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: alpha(blueGrey[400], 0.2),

      '& .linenumber': {
        color: grey[50],
      },
    },
  },
  closed: {
    backgroundColor: alpha(blueGrey[300], 0.1),
  },

  collapseButton: {
    padding: 0,
    height: 19,
    width: 12.2,
  },
});
