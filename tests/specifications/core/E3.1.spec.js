import app from '../../../index';
import request from 'supertest';

// Mock configuration
jest.mock('../../../config/cwpIps', () => [{cwpId: 1, ipAddr: '1.2.3.4'}]);

describe('E3.1 : must allow clients to identify themselves', () => {

  test('allow clients to identify themselves', () => {
    return request(app)
      .get('/identify')
      .set('X-Forwarded-For', '1.2.3.4')
      .expect(200)
      .expect(res => expect(res.body.id).toBe(1));
  });

  test('reject unknown clients', () => {
    return request(app)
      .get('/identify')
      .set('X-Forwarded-For', '1.2.3.5')
      .expect(404);
  });

});
