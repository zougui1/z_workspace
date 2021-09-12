import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';

import { ApiController } from './api.controller';

describe('ApiController', () => {

  describe('has a "index" method that', () => {

    it('should handle requests at GET /.', () => {
      expect(getHttpMethod(ApiController, 'index')).toBe('GET');
      expect(getPath(ApiController, 'index')).toBe('/');
    });

    it('should return a HttpResponseOK.', () => {
      const controller = createController(ApiController);
      const ctx = new Context({});

      const response = controller.index(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The response should be an instance of HttpResponseOK.');
      }

      expect(response.body).toBe('Hello world!');
    });
  });
});
