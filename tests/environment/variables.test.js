import app from '../../index';
import request from 'supertest';

// Mock configuration
jest.mock('../../config/cwpIps', () => [{cwpId: 1, ipAddr: '1.2.3.4'}]);

describe('env vars', () => {
  describe('FORCE_CLIENT_ID', () => {
    beforeEach(() => {
      process.env.FORCE_CLIENT_ID = '37';
    });

    afterEach(() => {
      delete process.env.FORCE_CLIENT_ID;
    });

    test('allow client identification override', () => {
      return request(app)
        .get('/identify')
        .set('X-Forwarded-For', '1.2.3.4')
        .expect(200)
        .expect(res => expect(res.body.id).toBe(37));
    });
  });

  describe('FOURME_ENV', () => {
    let oldVal;

    beforeEach(() => {
      oldVal = process.env.FOURME_ENV;
      process.env.FOURME_ENV = 'NON EXISTENT';
    });

    afterEach(() => {
      process.env.FOURME_ENV = oldVal;
    });

    test('should throw an error regarding non existent environment', () => {
      jest.resetModules();
      expect(() => require('../../src/env')).toThrow(/environment in?dentifier/i);
    });
  });
});
