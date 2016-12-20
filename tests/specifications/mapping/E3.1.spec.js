import app from '../../../index';
import request from 'supertest';

import fp from 'lodash/fp';

describe('E3.1 : software integrates in 4ME framework', () => {

  test('has a /status endpoint', () => {
    return request(app)
      .get('/status')
      .expect(200)
      .expect(res => expect(res.body.version).toBe(process.env.npm_package_version));
  });

  test('produce log on new room configuration', () => {
    const validMap = [
      {cwpId: 20, sectors: ['UR', 'XR']},
      {cwpId: 21, sectors: ['KR', 'HYR']},
      {cwpId: 22, sectors: ['UB', 'UN', 'KN', 'HN']},
      {cwpId: 23, disabled: true},
      {cwpId: 30, sectors: ['E', 'SE', 'KD', 'UF', 'KF', 'UH', 'XH', 'KH', 'HH', 'UE', 'XE', 'KE', 'HE']}
    ];

    return request(app)
      .post('/map')
      .send(validMap)
      .expect(res => {
        const logRecord = fp.pipe(
          fp.get('LOG_STREAM.records'),
          fp.last,
          fp.pick(['map', 'msg', "name", "payload"])
        )(global);

        expect(logRecord).toMatchSnapshot();
      });
  });


});
