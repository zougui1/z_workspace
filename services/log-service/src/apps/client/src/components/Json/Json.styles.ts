import { makeStyles } from '@zougui/react-styles';

export const useStyles = makeStyles({
  code: {
    display: 'block',
    letterSpacing: 0.2,

    '& .linenumber::selection': {
      userSelect: 'none',
      backgroundColor: 'transparent',
    },

    '& span::selection': {
      backgroundColor: '#fff1'
    }
  },
});
