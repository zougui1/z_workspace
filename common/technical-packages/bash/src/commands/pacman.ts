import { BashCommand } from '../BashCommand';

export const pacman = new BashCommand<PacmanArgs, string>('pacman', 'Package manager', {
  exec: {
    stdio: undefined,
  },
});

pacman.setAliases({
  query: 'Q',
  explicit: 'e',
  info: 'i',
})

export type PacmanArgs = PacmanQueryArgs;

export interface PacmanQueryArgs {
  query: true,
  explicit?: boolean;
  info?: boolean;
}
