import request from 'supertest';

import { createApp } from '../src/app';

describe('The server', () => {

  let app: any;

  beforeAll(async () => {
    app = await createApp();
  });

  it('should return a 200 status on GET / requests.', () => {
    return request(app)
      .get('/')
      .expect(200);
  });

  it('should return a 200 status on GET /api requests.', () => {
    return request(app)
      .get('/api')
      .expect(200, 'Hello world!');
  });
});
