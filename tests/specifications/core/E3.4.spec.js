import app from '../../../index';
import request from 'supertest';
import io from 'socket.io-client';
import _ from 'lodash';

describe('E3.4 : must log each room configuration change', () => {
  test('produce log on new room configuration', () => {
    const newMap = [
      {cwpId: 20, sectors: ['UR', 'XR']},
      {cwpId: 21, sectors: ['KR', 'HYR']},
      {cwpId: 22, sectors: ['UB', 'UN', 'KN', 'HN']},
      {cwpId: 23, disabled: true},
      {cwpId: 30, sectors: ['E', 'SE', 'KD', 'UF', 'KF', 'UH', 'XH', 'KH', 'HH', 'UE', 'XE', 'KE', 'HE']}
    ];

    return request(app)
      .post('/map')
      .send(newMap)
      .expect(res => {
        const logRecord = _.last(_.get(global, 'LOG_STREAM.records'));
        expect(logRecord.payload.commitMap).toBe(true);
        expect(logRecord.map).toEqual(newMap);
      });
  });

});
