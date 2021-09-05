import { makeStyles } from '../../../makeStyles';

export const classes = makeStyles({
  root: {
    border: {
      type: 'line',
      fg: 'white',
    },
  },
  disabled: {
    border: { fg: 'grey' },
  },

  textDisabled: {
    color: '#666',
  },
});
