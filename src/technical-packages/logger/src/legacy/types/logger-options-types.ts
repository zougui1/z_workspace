export interface StandardLogOptions {
  process?: boolean;
}

export interface StandardLogMessageOptions extends StandardLogOptions {
  message: string;
  label?: string;
  namespace?: string;
}

export interface ProfileLogMessageOptions {
  message?: string;
  logLabel?: string;
  profileLabel: string;
}
