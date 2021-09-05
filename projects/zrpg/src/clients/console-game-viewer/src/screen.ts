import blessed from 'blessed';

import { exit } from './process';

export const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'Test',
  cursor: {
    artificial: true,
    shape: 'line',
    blink: true,
    color: 'white',
    // @ts-ignore
    ch: '#',
  },
});

screen.key(['C-c'], exit);
