import { makeStyles } from '@zougui/react-styles';

export const useStyles = makeStyles({
  root: {
    color: '#abb2bf',
  },
  whitespace: {
    display: 'inline-block',
    // use `letterSpacing` instead of `width`
    // so that when the whitespace is selected
    // the selection is done on the entire size of the element
    // which is not the case with `width`
    letterSpacing: 4.65,
  },
});
