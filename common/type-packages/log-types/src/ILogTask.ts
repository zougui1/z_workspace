export interface ILogTask {
  id: string;
  timing?: {
    formatted: string;
    milliseconds: number;
  };
  subTaskIds?: string[];
}
