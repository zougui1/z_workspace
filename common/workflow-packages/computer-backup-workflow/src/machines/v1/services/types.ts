import { Reasons, ProgressBars } from './enums';

export interface Source {
  label: string;
  required?: boolean;
  excludes?: string[];
  inputs: string[];
}

export interface BackupOptions {
  threads: number;
  workspaceDir: string;
  backupsDir: string;
  reason: {
    type: Reasons;
    packages?: string[];
  };
  progressBars: ProgressBars[];
  backup: {
    date: moment.Moment;
    dirFormat: string;
  };
}
