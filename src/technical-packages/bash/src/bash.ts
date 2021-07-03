import { BashEnvVar } from './BashEnvVar';
import { BashStdout } from './BashStdout';
import {
  awk, AwkArgs,
  blkid, BlkidArgs,
  du, DuArgs,
  pigz, PigzArgs,
  pv, PvArgs,
  rm, RmArgs,
  tar, TarArgs,
  rsync, RsyncArgs,
  pacman, PacmanArgs,
  mount, MountArgs,
  umount, UmountArgs,
  udisksctl, UdisksctlArgs,
  udevadm, UdevadmArgs,
  move, MoveArgs,
  zstd, ZstdArgs,
} from './commands';
import { compress } from './composed-commands';
import * as commands from './commands';
import { BashCommand } from './BashCommand';
import { BashSubCommand, BashSubCommandOptions } from './BashSubCommand';
import { GroupedCommands, CommandSeparation } from './GroupedCommands';

export const bash = {
  commands,

  // commands
  awk: (args: AwkArgs): typeof awk => awk.clone().setArgs(args),
  blkid: (args: BlkidArgs): typeof blkid => blkid.clone().setArgs(args),
  du: (args: DuArgs): typeof du => du.clone().setArgs(args),
  pigz: (args: PigzArgs): typeof pigz => pigz.clone().setArgs(args),
  pv: (args: PvArgs): typeof pv => pv.clone().setArgs(args),
  rm: (args: RmArgs): typeof rm => rm.clone().setArgs(args),
  tar: (args: TarArgs): typeof tar => tar.clone().setArgs(args),
  rsync: (args: RsyncArgs): typeof rsync => rsync.clone().setArgs(args),
  pacman: (args: PacmanArgs): typeof pacman => pacman.clone().setArgs(args),
  mount: (args: MountArgs): typeof mount => mount.clone().setArgs(args),
  umount: (args: UmountArgs): typeof umount => umount.clone().setArgs(args),
  udisksctl: (args: UdisksctlArgs): typeof udisksctl => udisksctl.clone().setArgs(args),
  udevadm: (args: UdevadmArgs): typeof udevadm => udevadm.clone().setArgs(args),
  move: (args: MoveArgs): typeof move => move.clone().setArgs(args),
  zstd: (args: ZstdArgs = {}): typeof zstd => zstd.clone().setArgs(args),

  // command options
  envVar: (name: string): BashEnvVar => new BashEnvVar(name),
  stdout: (value: string): BashStdout => new BashStdout(value),
  subCommand: (command: string | BashCommand<any> | GroupedCommands, options?: BashSubCommandOptions): BashSubCommand => new BashSubCommand(command, options),

  // group commands
  separate: (...commands: (BashCommand<any> | GroupedCommands)[]): GroupedCommands => {
    const group = new GroupedCommands(CommandSeparation.separate);
    group.addCommands(commands);
    return group;
  },
  and: (...commands: (BashCommand<any> | GroupedCommands)[]): GroupedCommands => {
    const group = new GroupedCommands(CommandSeparation.and);
    group.addCommands(commands);
    return group;
  },
  pipe: (...commands: (BashCommand<any> | GroupedCommands)[]): GroupedCommands => {
    const group = new GroupedCommands(CommandSeparation.pipe);
    group.addCommands(commands);
    return group;
  },

  // composed commands
  compress,
}
