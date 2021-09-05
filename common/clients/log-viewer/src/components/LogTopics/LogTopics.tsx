import { Typography } from '@material-ui/core';

import { useStyles } from './LogTopics.styles';

export const LogTopics = ({ topics }: LogTopicsProps) => {
  const classes = useStyles();

  return (
    <div>
      {topics.map(topic => (
        <Typography key={topic} component="span" className={classes.topic}>
          #{topic}
        </Typography>
      ))}
    </div>
  );
}

export interface LogTopicsProps {
  topics: string[];
}
