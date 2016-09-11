import app from '../../index';
import request from 'supertest';

jest.mock('../../config/cwpIps', () => [{cwpId: 1, ipAddr: '1.2.3.4'}]);

describe('allow clients to identify themselves', () => {

  test('allow clients to identify themselves', () => {

    return request(app)
      .get('/cwp/getMine')
      .set('X-Forwarded-For', '1.2.3.4')
      .expect(res => {
        console.log(res.body);
      })
      .expect(200);
  });
});
