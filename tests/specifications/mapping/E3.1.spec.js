import app from '../../../index';
import request from 'supertest';

import fp from 'lodash/fp';

jest.mock('../../../config/cwps', () => {
  const mockCwps = [{id: 1, type: "cwp"}, {id: 2, type: "cwp"}];
  return mockCwps;
});

jest.mock('../../../config/sectors', () => {
  const mockSectors = [
    {name: "UR", elementarySectors: ["UR"]},
    {name: "XR", "elementarySectors": ["XR"]},
  ];
  return mockSectors;
});

describe('E3.1 : software integrates in 4ME framework', () => {

  test('has a /status endpoint', () => {
    return request(app)
      .get('/status')
      .expect(200)
      .expect(res => expect(res.body.version).toBe(process.env.npm_package_version));
  });

  test('produce log on new room configuration', () => {
    const newMap = [
      {cwpId: 2, sectors: ["UR", "XR"]},
    ];

    return request(app)
      .post('/mapping')
      .send(newMap)
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


