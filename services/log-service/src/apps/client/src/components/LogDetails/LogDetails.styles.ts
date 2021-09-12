import { makeStyles } from '@zougui/react-styles';

export const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  tabs: {
    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px',
    // the margin-bottom is necessary to be able to see
    // the box-shadow when the panel is scrolled down
    marginBottom: 3,
  },
  panelsWrapper: {
    maxHeight: 680,
    overflowY: 'auto',
    paddingBottom: 3,
  },
});
