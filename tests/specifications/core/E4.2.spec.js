import app from '../../../index';
import request from 'supertest';


describe('E4.2 : must present status through a specific route', () => {
  test('check status route', () => {
    return request(app)
      .get('/status')
      .expect(200);
  });

  test('check status route format', () => {
    return request(app)
      .get('/status')
      .expect(res => {
        const expectedKeys = [
          'version',
          'coreSocketClients',
          'mappingSocketClients',
        ];

        expectedKeys.map(key => expect(res.body[key]).toBeDefined());
      });
  });

  test('check version returned', () => {
    const version = process.env.npm_package_version;
    //require('../../package.json').version;

    return request(app)
      .get('/status')
      .expect(res => expect(res.body.version).toBe(version));
  });
});
