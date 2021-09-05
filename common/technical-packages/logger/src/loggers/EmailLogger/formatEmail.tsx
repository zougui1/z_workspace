//import React from 'react';
//import moment from 'moment';
//import { PostonentsProvider, Email, Container, Header, Row, Column, Text, Footer, renderEmail } from 'postonents'

import { ILog } from '@zougui/log-types';

//import { LogColor } from '../../enums';

/*const MyEmail = ({ data }: LogEmailProps) => {
  const { logs, subject } = data;

  return (
    <PostonentsProvider>
      <Email title={subject}>
        <Header>
          <Container alignment="center">
            <Row>
              <Column>
                <Text style={{ fontSize: 26 }}>{subject}</Text>
              </Column>
            </Row>
          </Container>
        </Header>

        {logs.map(log => (
          <Container alignment="center">
            <Row>
              <Column style={{ marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}>
                <Text style={{ color: LogColor[log.level], fontSize: 20 }}>{log.level}</Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}>
                <Text>{log.message}</Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}>
                <Text style={{ color: '#eeeeee' }}>Logged at: {moment(log.time.createdAt).format(log.time.format)}</Text>
              </Column>
            </Row>
          </Container>
        ))}

        <Footer>
          <Container>
            <Row>
              <Column>
                <Text style={{ color: '#eeeeee' }}>Sent at: {moment().format(logs[0]?.time.format)}</Text>
              </Column>
            </Row>
          </Container>
        </Footer>
      </Email>
    </PostonentsProvider>
  );
}*/

/*interface LogEmailProps {
  data: {
    logs: ILog[];
    subject: string;
  };
}*/

export const formatEmail = (logs: ILog[], subject: string): string => {
  return '';
  //return renderEmail(MyEmail as React.FC, { data: { logs, subject } });
}
