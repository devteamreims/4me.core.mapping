import {APPDIR} from '../settings'
// Stubs
import * as mySocketStub from '../stubs/socket';

const modulePath = APPDIR + 'mapping/notifier';
const moduleStubs = {
  '../socket': mySocketStub
};

let validOldMap = [
  {cwpId: 2, sectors: ['UR', 'XR']},
  {cwpId: 3, sectors: ['KR']}
];

let validNewMap = [
  {cwpId: 2, sectors: ['UR', 'XR', 'KR']},
  {cwpId: 3, sectors: []}
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
      });
    });
  });
});