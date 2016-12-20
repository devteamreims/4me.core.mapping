import request from 'supertest';
import io from 'socket.io-client';
import _ from 'lodash';

describe('E3.5 : must save and reload room configuration on restart', () => {

  const newMap = [
    {cwpId: 20, sectors: ['UR', 'XR']},
    {cwpId: 21, sectors: ['KR', 'HYR']},
    {cwpId: 22, sectors: ['UB', 'UN', 'KN', 'HN']},
    {cwpId: 23, disabled: true},
    {cwpId: 30, sectors: ['E', 'SE', 'KD', 'UF', 'KF', 'UH', 'XH', 'KH', 'HH', 'UE', 'XE', 'KE', 'HE']}
  ];

  const differentMap = [
    {cwpId: 20, sectors: ['UR', 'XR']},
    {cwpId: 21, sectors: ['KR', 'HYR']},
    {cwpId: 22, sectors: ['KN', 'HN']},
    {cwpId: 11, sectors: ['UB', 'UN']},
    // {cwpId: 23, disabled: true},
    {cwpId: 30, sectors: ['E', 'SE', 'KD', 'UF', 'KF', 'UH', 'XH', 'KH', 'HH', 'UE', 'XE', 'KE', 'HE']}
  ];

  test('load room configuration', () => {
    jest.resetModules();

    const db = require('../../../src/database')();
    db._setCache({map: newMap});
    const app = require('../../../index').default;

    return request(app)
      .get('/map')
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
          .post('/map')
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
