import { PickOne } from './utils';

export interface IDialog {
  type: string;
  options?: DialogOption[];
  text?: string;
  $on?: {
    $done?: PickOne<Dialog>;
    $answer?: Record<string, PickOne<Dialog>>;
  };
}

export interface DialogOption {
  value: string | number;
  text: string;
}

export type Dialog = string | IDialog;
