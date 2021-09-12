import { blue } from '@material-ui/core/colors';

import { makeStyles } from '@zougui/react-styles';

export const useStyles = makeStyles({
  topic: {
    fontSize: '0.9rem',
    color: blue[300],

    '&:not(:last-child)': {
      marginRight: 8,
    },
  },
  section: {
    paddingBottom: 16,
  },
});
