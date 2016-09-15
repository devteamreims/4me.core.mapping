import app from '../../../index';
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


describe('E3.4 : must log each room configuration change', () => {
  test('produce log on new room configuration', () => {
    const newMap = [
      {cwpId: 2, sectors: ["UR", "XR"]},
    ];

    return request(app)
      .post('/mapping')
      .send(newMap)
      .expect(res => {
        const logRecord = _.last(_.get(global, 'LOG_STREAM.records'));
        expect(logRecord.payload.commitMap).toBe(true);
        expect(logRecord.map).toEqual(newMap);
      });
  });

});
