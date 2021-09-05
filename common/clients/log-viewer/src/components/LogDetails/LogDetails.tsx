import { ILog } from '@zougui/log-types';
import { Tabs } from '@zougui/react-core';

import { useStyles } from './LogDetails.styles';
import { LogInformationTab } from './LogInformationTab';
import { LogTransactionTab } from './LogTransactionTab';
import { LogTaskTab } from './LogTaskTab';

export const LogDetails = ({ log }: LogDetailsProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Tabs className={classes.tabs} panelsWrapperProps={{ className: classes.panelsWrapper }} unmountOnExit>
        <Tabs.Tab>
          <Tabs.Tab.Title>Information</Tabs.Tab.Title>

          <Tabs.Tab.Panel>
            <LogInformationTab log={log} />
          </Tabs.Tab.Panel>
        </Tabs.Tab>

        <Tabs.Tab>
          <Tabs.Tab.Title disabled={!log.transaction}>Transaction</Tabs.Tab.Title>

          <Tabs.Tab.Panel>
            {log.transaction && (
              <LogTransactionTab transaction={log.transaction} />
            )}
          </Tabs.Tab.Panel>
        </Tabs.Tab>

        <Tabs.Tab>
          <Tabs.Tab.Title disabled={!log.task}>Task</Tabs.Tab.Title>

          <Tabs.Tab.Panel>
            {log.task && (
              <LogTaskTab task={log.task} />
            )}
          </Tabs.Tab.Panel>
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}

export interface LogDetailsProps {
  log: ILog;
}
