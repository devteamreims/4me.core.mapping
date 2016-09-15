import request from 'supertest';
import io from 'socket.io-client';
import _ from 'lodash';


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


describe('E3.5 : must save and reload room configuration on restart', () => {

  const newMap = [
    {cwpId: 2, sectors: ["UR", "XR"]},
  ];

  const differentMap = [
    {cwpId: 1, sectors: ["UR"]},
    {cwpId: 2, sectors: ["XR"]},
  ];

  test('load room configuration', () => {
    jest.resetModules();

    const db = require('../../../src/database')();
    db._setCache({map: newMap});
    const app = require('../../../index').default;

    return request(app)
      .get('/mapping')
      .expect(res => expect(res.body).toEqual(newMap));
  });

  test('save room configuration', () => {
    jest.resetModules();

    const db = require('../../../src/database')();
    db._setCache({map: newMap});
    const app = require('../../../index').default;

    return Promise.resolve()
      .then(() =>
        request(app)
          .post('/mapping')
          .send(differentMap)
      )
      .then(() =>
        db.get('map')
          .then(map => {
            expect(map).toEqual(differentMap);
          })
      );
  });

});
