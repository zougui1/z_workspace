export interface ICommand {
  exec(options?: Record<string, any>): Promise<unknown>;
  toString(options?: Record<string, any>): string;
  toDescription(): string;
  isAvailableOrFail(): Promise<void>;
  isAvailable(): Promise<boolean>;
}
