export interface ILogTransaction {
  id: string;
  topics: string[];
  data: Record<string, any>;
  time: {
    startedAt: string;
    finishedAt?: string;
  };
}
