import {APPDIR} from '../settings'
// Stubs
import * as mySocketStub from '../stubs/socket';

const modulePath = APPDIR + 'mapping/notifier';
const moduleStubs = {
  '../socket': mySocketStub
};

let validOldMap = [
  {cwpId: 2, sectors: ['UR', 'XR']},
  {cwpId: 3, sectors: ['KR']},
  {cwpId: 4, sectors: ['YR', 'HR']}
];

let validNewMap = [
  {cwpId: 2, sectors: ['UR', 'XR', 'KR']},
  {cwpId: 3, sectors: []},
  {cwpId: 4, sectors: ['YR', 'HR']}
];

describe('mapNotifier', () => {
  it('should load', () => {
    let mapNotifier = proxyquire(modulePath, moduleStubs).default;
  });

  describe('notifier', () => {
    let notifier;
    beforeEach(() => {
      notifier = proxyquire(modulePath, moduleStubs).default;
    });

    describe('notify', () => {
      it('should have a notify method', () => {
        notifier.notify.should.be.a('function');
      });

      it('should refuse invalid input', () => {
        expect(() => notifier.notify()).to.throws(/invalid argument/i);
      });

      it('should call mySocket.emitToCwps', () => {
        notifier.notify(validOldMap, validNewMap);
        mySocketStub.default.emitToCwps.should.have.been.called;
        mySocketStub.default.emitToCwps.lastCall.args[1].should.eql('mapping:refresh');
      });

      it('should compute changed CWPs properly', () => {
        notifier.notify(validOldMap, validNewMap);
        mySocketStub.default.emitToCwps.lastCall.args[0].should.deep.eql([2, 3]);
      });

      it('should not notify omitted cwps when sectors equals []', () => {
        const expected = [2, 4].sort();
        let old = _.cloneDeep(validOldMap);
        old[2].sectors = [];
        old[1] = undefined;
        old = _.compact(old);

        notifier.notify(old, validNewMap);
        mySocketStub.default.emitToCwps.lastCall.args[0].sort().should.deep.eql(expected);
      });

      it('should notify cwps added in the new map', () => {
        const expected = [2, 3, 5];
        let newMap = _.cloneDeep(validNewMap);
        newMap.push({cwpId: 5, sectors: ['UF']});

        notifier.notify(validOldMap, newMap);
        mySocketStub.default.emitToCwps.lastCall.args[0].sort().should.deep.eql(expected);
      });

      it('should notify cwps removed in the new map', () => {
        const expected = [4];
        let newMap = _.cloneDeep(validOldMap);
        newMap[2] = undefined;
        newMap = _.compact(newMap);

        notifier.notify(validOldMap, newMap);
        mySocketStub.default.emitToCwps.lastCall.args[0].sort().should.deep.eql(expected);
      });

      it('should notify cwps when moving a group of sectors', () => {
        const expected = [2, 4].sort();
        let oldMap = [
          {cwpId: 2, sectors: ['UR', 'XR']},
          {cwpId: 3, sectors: ['KR']},
          {cwpId: 4, sectors: []}
        ];

        let newMap = [
          {cwpId: 2, sectors: []},
          {cwpId: 3, sectors: ['KR']},
          {cwpId: 4, sectors: ['UR', 'XR']}
        ];

        notifier.notify(oldMap, newMap);
        mySocketStub.default.emitToCwps.lastCall.args[0].sort().should.deep.eql(expected);

      });
    });
  });
});