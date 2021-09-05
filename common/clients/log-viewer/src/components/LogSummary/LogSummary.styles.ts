import { makeStyles } from '@zougui/react-styles';

export const useStyles = makeStyles({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',

    '* > *:not(:last-child)': {
      marginRight: 8,
    },
  },
});
