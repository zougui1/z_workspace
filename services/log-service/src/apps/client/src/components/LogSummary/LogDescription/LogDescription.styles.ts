import { grey, purple } from '@material-ui/core/colors';

import { makeStyles } from '@zougui/react-styles';

export const useStyles = makeStyles({
  root: {
    '& $part:not(:last-child)': {
      marginRight: 8,
    },
    '& $section:not(:last-child)': {
      marginRight: 8,
    },
  },
  section: {},
  part: {},
  date: {
    color: grey[300],
  },
  appName: {
    color: purple.A400,
  },
});
