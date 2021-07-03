import React from 'react';
import moment from 'moment';
import { PostonentsProvider, Email, Container, Header, Row, Column, Text, Footer, renderEmail } from 'postonents'
import { Exception } from '@zougui/error';

import { ILoggerOptions } from '../types';
import { LogLevel } from '../LogLevel';
import { List } from '../log-utils';
import { ILogObject } from '../log-utils/LogV2';
import { EmailLogConfig } from '../types/logger-config-types';

const MyEmail: React.FC = ({ data }: any) => {
  const { level, log, options } = data as LogEmailProps['data'];
  const title = `Backup: ${level}`;
  const time = log.getTime();

  const dirtyMessage = log.getMessage();

  console.log('some message', dirtyMessage)
  const message = formatMessage(dirtyMessage);

  return (
    <PostonentsProvider>
      <Email title={title}>
        <Header>
          <Container alignment="center">
            <Row>
              <Column>
                <Text style={{ color: options.config[level].color, fontSize: 26 }}>{title}</Text>
              </Column>
            </Row>
          </Container>
        </Header>

        <Container alignment="center">
          <Row>
            <Column style={{ marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}>
              {message}
            </Column>
          </Row>
        </Container>

        <Footer>
          <Container>
            <Row>
              <Column>
                <Text style={{ color: '#eeeeee' }}>Logged at: {moment(time.createdAt).format(time.format)}</Text>
              </Column>
            </Row>

            {options.logger.logFile && (
              <Row>
                <Column>
                  <Text style={{ color: '#eeeeee' }}>For more details see: {options.logger.logFile}</Text>
                </Column>
              </Row>
            )}
          </Container>
        </Footer>
      </Email>
    </PostonentsProvider>
  );
}

interface LogEmailProps {
  data: {
    level: LogLevel;
    log: ILogObject;
    options: FormatMessageOptions;
  };
}

export const formatEmail = (level: LogLevel, log: ILogObject, options: FormatMessageOptions): string => {
  return renderEmail(MyEmail, { data: { level, log, options } });
}

export const formatMessage = (message: any): React.ReactNode => {
  if (!message || typeof message !== 'object') {
    return <Text>{message}</Text>;
  }

  if (message instanceof Exception) {
    const label = `[Exception ${message.constructor.name}]`;

    return (
      <>
        <Text>{label}</Text>
        <Row>
          <Column style={{ marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}>
            <Text>message: {formatMessage(message.message)}</Text>
          </Column>
        </Row>

        {message.details && (
          <Row>
            <Column style={{ marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}>
              <Text>details: {formatMessage(message.details)}</Text>
            </Column>
          </Row>
        )}
      </>
    );
  }

  if (message instanceof Error) {
    const label = `[Error ${message.constructor.name}]`;

    return (
      <>
        <Text>{label}</Text>
        <Row>
          <Column style={{ marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}>
            <Text>message: {formatMessage(message.message)}</Text>
          </Column>
        </Row>
      </>
    );
  }

  if (message instanceof List) {
    return formatList(message);
  }

  return JSON.stringify(message, null, 2);
}

const formatList = (list: List<any>): React.ReactNode => {
  return (
    <>
      <Row style={{ marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}>
        <Column style={{ marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}>
          <Text>{list.label}</Text>
        </Column>
      </Row>

      {list.items.map(item => (
        <Row style={{ marginLeft: 16, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }} key={JSON.stringify(item)}>
          <Column style={{ marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}>{formatMessage(item)}</Column>
        </Row>
      ))}
    </>
  );
}

export type FormatMessageOptions = {
  logger: ILoggerOptions;
  config: EmailLogConfig;
}
