import minimatch from 'minimatch';

import { LOG_NAMESPACE, LOG_TOPICS, LOG_LEVELS } from '../env';

export const canLog = (options: CanLogOptions): boolean => {
  const { namespace, topics, level } = options;

  return (
    minimatch(namespace, LOG_NAMESPACE) &&
    LOG_TOPICS.every(topicPattern => topics.some(topic => minimatch(topic, topicPattern))) &&
    LOG_LEVELS.every(levelPattern => minimatch(level, levelPattern))
  );
}

export interface CanLogOptions {
  namespace: string;
  topics: string[];
  level: string;
}
